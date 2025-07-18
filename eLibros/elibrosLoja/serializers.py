from rest_framework import serializers
from django.conf import settings
import os
from .models import (
    Livro, Autor, Categoria, Genero, Cliente, 
    Carrinho, ItemCarrinho, Pedido, Cupom, Endereco
)
from accounts.models import Usuario


class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'


class LivroSerializer(serializers.ModelSerializer):
    # Usar StringRelatedField para evitar problemas com ManyToMany
    autores = serializers.StringRelatedField(source='autor', many=True, read_only=True)
    categorias = serializers.StringRelatedField(source='categoria', many=True, read_only=True)
    generos = serializers.StringRelatedField(source='genero', many=True, read_only=True)
    capa = serializers.SerializerMethodField()
    
    class Meta:
        model = Livro
        fields = ['id', 'titulo', 'subtitulo', 'autores', 'editora', 'ISBN', 
                 'data_de_publicacao', 'ano_de_publicacao', 'capa', 'sinopse',
                 'generos', 'categorias', 'preco', 'desconto', 'quantidade', 
                 'qtd_vendidos']
    
    def get_capa(self, obj):
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


class LivroCreateSerializer(serializers.ModelSerializer):
    """Serializer para criar/editar livros"""
    class Meta:
        model = Livro
        fields = '__all__'


class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
    endereco = EnderecoSerializer(read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'


class ItemCarrinhoSerializer(serializers.ModelSerializer):
    livro = LivroSerializer(read_only=True)
    
    class Meta:
        model = ItemCarrinho
        fields = '__all__'


class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True, source='itemcarrinho_set')
    
    class Meta:
        model = Carrinho
        fields = '__all__'


class CupomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cupom
        fields = '__all__'


class PedidoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    cupom = CupomSerializer(read_only=True)
    endereco = EnderecoSerializer(read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active']
        read_only_fields = ['date_joined']


class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = Usuario.objects.create_user(**validated_data)
        return user
