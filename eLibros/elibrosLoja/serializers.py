import os
from typing import Any
from .models import (
    Livro, Autor, Categoria, Genero, Cliente, 
    Carrinho, ItemCarrinho, Pedido, Cupom, Endereco,
    Avaliacao, CurtidaAvaliacao
)
from accounts.models import Usuario
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.utils.crypto import get_random_string


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
        fields = ['id', 'email', 'username', 'nome', 'CPF', 'telefone', 'genero', 'dt_nasc', 'date_joined', 'is_active', 'email_is_verified']
        read_only_fields = ['id', 'date_joined', 'is_active']


class UsuarioCreateSerializer(serializers.ModelSerializer[Usuario]):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Usuario
        fields = [
            'email', 'username', 'nome', 'CPF', 'telefone', 
            'genero', 'dt_nasc', 'password', 'password_confirm'
        ]

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def create(self, validated_data: dict[str, Any]) -> Usuario:
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class UsuarioLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError("Email e senha são obrigatórios.")
        
        user = Usuario.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("Credenciais inválidas.")
        
        if not user.check_password(password):
            raise AuthenticationFailed("Credenciais inválidas.")
            
        if not user.is_active:
            raise AuthenticationFailed("Perfil desabilitado. Se for um erro, entre em contato com o administrador.")

        attrs['user'] = user
        return attrs
    
class UsuarioLogoutSerializer(serializers.Serializer):
    """Serializer para logout de usuário com blacklist de token"""
    refresh = serializers.CharField()
    
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        self.token = attrs.get('refresh')
        return attrs
    
    def save(self, **kwargs: Any) -> None:
        try: 
            token = RefreshToken(self.token)
            token.blacklist()
        except TokenError as e:
            raise serializers.ValidationError(f"Erro ao invalidar o token: {str(e)}")

class PasswordResetSerializer(serializers.Serializer):
    """Serializer para redefinição de senha"""
    email = serializers.EmailField()
    
    def validate_email(self, value: str) -> str:
        if not Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Usuário com este email não encontrado.")
        return value
    
    def save(self, **kwargs: Any) -> dict[str, Any]:
        email = self.validated_data['email']  # type: ignore
        user = Usuario.objects.get(email=email)
        otp = get_random_string(length=6, allowed_chars='0123456789')
        user.login_token = otp
        user.save()
        return {'user': user, 'otp': otp}


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer para confirmação de redefinição de senha"""
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("As senhas não coincidem.")
        
        email = attrs.get('email')
        otp = attrs.get('otp')
        
        user = Usuario.objects.filter(email=email, login_token=otp).first()
        if not user:
            raise serializers.ValidationError("Token inválido ou expirado.")
        
        attrs['user'] = user
        return attrs
    
    def save(self, **kwargs: Any) -> Usuario:
        user = self.validated_data['user']  # type: ignore
        user.set_password(self.validated_data['new_password'])  # type: ignore
        user.login_token = None  # Limpar o token após uso
        user.save()
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
        fields = ['texto']  # Removendo 'livro' pois vem do contexto da view
    
    def validate_texto(self, value: str) -> str:
        """Método customizado para o campo de texto de uma avaliação
        \n Segue a seguinte sintaxe: `validate_<field_name>` """
        
        if len(value.strip()) < 10:
            raise serializers.ValidationError("A avaliação deve ter pelo menos 10 caracteres.")
        return value.strip()
    
    def create(self, validated_data: dict[str, Any]) -> Avaliacao:
        # O usuário e livro vêm do contexto da view
        validated_data['usuario'] = self.context['request'].user
        # O livro deve ser passado pela view que chama o serializer
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
