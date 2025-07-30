from rest_framework import serializers
import os
from typing import Any
from .models import (
    Livro, Autor, Categoria, Genero, Cliente, 
    Carrinho, ItemCarrinho, Pedido, Cupom, Endereco,
    Avaliacao, CurtidaAvaliacao
)
from accounts.models import Usuario


class AutorSerializer(serializers.ModelSerializer[Autor]):
    class Meta: 
        model = Autor
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer[Categoria]):
    class Meta: 
        model = Categoria
        fields = '__all__'


class GeneroSerializer(serializers.ModelSerializer[Genero]):
    class Meta: 
        model = Genero
        fields = '__all__'


class LivroSerializer(serializers.ModelSerializer[Livro]):
    # Usar StringRelatedField para evitar problemas com ManyToMany
    autores = serializers.StringRelatedField(source='autor', many=True, read_only=True)  # type: ignore
    categorias = serializers.StringRelatedField(source='categoria', many=True, read_only=True)  # type: ignore
    generos = serializers.StringRelatedField(source='genero', many=True, read_only=True)  # type: ignore
    capa = serializers.SerializerMethodField()
    
    class Meta: 
        model = Livro
        fields = ['id', 'titulo', 'subtitulo', 'autores', 'editora', 'ISBN', 
                 'data_de_publicacao', 'ano_de_publicacao', 'capa', 'sinopse',
                 'generos', 'categorias', 'preco', 'desconto', 'quantidade', 
                 'qtd_vendidos']
    
    def get_capa(self, obj: Livro) -> str | None:
        """Retorna a URL completa da capa"""
        if obj.capa:
            # Se estivermos no Codespace, usar a URL pública
            if 'CODESPACE_NAME' in os.environ:
                codespace_name = os.getenv("CODESPACE_NAME")
                codespace_domain = os.getenv("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
                # Usar a mesma URL base que a API mas sem o /api/v1
                return f'https://{codespace_name}-8000.{codespace_domain}{obj.capa.url}'
            else:
                # Para desenvolvimento local
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.capa.url)
                return obj.capa.url
        return None


class LivroCreateSerializer(serializers.ModelSerializer[Livro]):
    """Serializer para criar/editar livros"""
    class Meta:
        model = Livro
        fields = '__all__'


class EnderecoSerializer(serializers.ModelSerializer[Endereco]):
    class Meta:
        model = Endereco
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer[Cliente]):
    endereco = EnderecoSerializer(read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'


class ItemCarrinhoSerializer(serializers.ModelSerializer[ItemCarrinho]):
    livro = LivroSerializer(read_only=True)
    
    class Meta:
        model = ItemCarrinho
        fields = '__all__'


class CarrinhoSerializer(serializers.ModelSerializer[Carrinho]):
    itens = ItemCarrinhoSerializer(many=True, read_only=True, source='itemcarrinho_set')
    
    class Meta:
        model = Carrinho
        fields = '__all__'


class CupomSerializer(serializers.ModelSerializer[Cupom]):
    class Meta:
        model = Cupom
        fields = '__all__'


class PedidoSerializer(serializers.ModelSerializer[Pedido]):
    cliente = ClienteSerializer(read_only=True)
    cupom = CupomSerializer(read_only=True)
    endereco = EnderecoSerializer(read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer[Usuario]):
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active']
        read_only_fields = ['date_joined']


class UsuarioCreateSerializer(serializers.ModelSerializer[Usuario]):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def create(self, validated_data: dict[str, Any]) -> Usuario:
        validated_data.pop('password_confirm')
        user = Usuario.objects.create_user(**validated_data)
        return user


class AvaliacaoSerializer(serializers.ModelSerializer[Avaliacao]):
    """Serializer para leitura de avaliações"""
    
    usuario_nome = serializers.ReadOnlyField()
    usuario_id = serializers.ReadOnlyField(source='usuario.id')
    usuario_username = serializers.ReadOnlyField(source='usuario.username')
    livro_titulo = serializers.ReadOnlyField(source='livro.titulo')
    pode_curtir = serializers.SerializerMethodField()
    usuario_curtiu = serializers.SerializerMethodField()
    
    class Meta:
        model = Avaliacao
        fields = [
            'id', 'texto', 'curtidas', 'data_publicacao',
            'usuario_nome', 'usuario_id', 'usuario_username',
            'livro', 'livro_titulo', 'pode_curtir', 'usuario_curtiu'
        ]
        read_only_fields = ['id', 'curtidas', 'data_publicacao']
    
    def get_pode_curtir(self, obj: Avaliacao) -> bool:
        """Verifica se o usuário atual pode curtir esta avaliação"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        # Usuário não pode curtir a própria avaliação
        return request.user != obj.usuario # type: ignore
    
    def get_usuario_curtiu(self, obj: Avaliacao) -> bool:
        """Verifica se o usuário atual já curtiu esta avaliação"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return CurtidaAvaliacao.objects.filter(
            usuario=request.user, 
            avaliacao=obj
        ).exists()


class AvaliacaoCreateSerializer(serializers.ModelSerializer[Avaliacao]):
    """Serializer para criação de avaliações"""
    
    class Meta:
        model = Avaliacao
        fields = ['livro', 'texto']
    
    def validate_texto(self, value: str) -> str:
        """Método customizado para o campo de texto de uma avaliação
        \n Segue a seguinte sintaxe: `validate_<field_name>` """
        
        if len(value.strip()) < 10:
            raise serializers.ValidationError("A avaliação deve ter pelo menos 10 caracteres.")
        return value.strip()
    
    def create(self, validated_data: dict[str, Any]) -> Avaliacao:
        # O usuário vem do contexto da view
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class CurtidaAvaliacaoSerializer(serializers.ModelSerializer[CurtidaAvaliacao]):
    """Serializer para curtidas"""
    
    class Meta:
        model = CurtidaAvaliacao
        fields = ['avaliacao']
    
    def create(self, validated_data: dict[str, Any]) -> CurtidaAvaliacao:
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class EstatisticasLivroSerializer(serializers.Serializer[dict[str, Any]]):
    """Serializer para estatísticas de avaliações de um livro"""
    
    total_avaliacoes = serializers.IntegerField()
    avaliacoes_recentes = AvaliacaoSerializer(many=True)
