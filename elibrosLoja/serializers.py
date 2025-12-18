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
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .utils import get_cliente_from_user

from django.utils.crypto import get_random_string
from utils.imagekit_serializers import ImageKitUploadMixin, ImageKitImageField


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
    capa_url = serializers.URLField(read_only=True)
    
    class Meta: 
        model = Livro
        fields = ['id', 'titulo', 'subtitulo', 'autores', 'editora', 'ISBN', 
                 'data_de_publicacao', 'ano_de_publicacao', 'capa_url', 'sinopse',
                 'generos', 'categorias', 'preco', 'desconto', 'quantidade', 
                 'qtd_vendidos']


class LivroCreateSerializer(ImageKitUploadMixin, serializers.ModelSerializer[Livro]):
    """Serializer para criar/editar livros com upload de capa para ImageKit"""
    capa = ImageKitImageField(required=False, allow_null=True, write_only=True)
    
    class Meta:
        model = Livro
        fields = '__all__'
    
    def create(self, validated_data: dict[str, Any]) -> Livro:
        capa_file = validated_data.pop('capa', None)
        livro = super().create(validated_data)
        # Upload da capa para ImageKit na pasta correta
        if capa_file:
            upload_data = self.handle_imagekit_upload(
                image_file=capa_file,
                folder='elibros/capas',
                instance=None,
                url_field='capa_url',
                file_id_field='capa_file_id'
            )
            for field, value in upload_data.items():
                setattr(livro, field, value)
            livro.save()
        return livro
    
    def update(self, instance: Livro, validated_data: dict[str, Any]) -> Livro:
        capa_file = validated_data.pop('capa', None)
        # Upload da nova capa para ImageKit (deleta a antiga automaticamente)
        if capa_file:
            upload_data = self.handle_imagekit_upload(
                image_file=capa_file,
                folder='elibros/capas',
                instance=instance,
                url_field='capa_url',
                file_id_field='capa_file_id'
            )
            for field, value in upload_data.items():
                validated_data[field] = value
        return super().update(instance, validated_data)



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
    itens = ItemCarrinhoSerializer(many=True, read_only=True, source='items_do_carrinho')
    
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
    itens = ItemCarrinhoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'


class PedidoCreateSerializer(serializers.Serializer[dict[str, Any]]):
    """Serializer para criar um pedido a partir do carrinho ou itens específicos"""
    
    # Opção 1: Criar pedido a partir do carrinho existente
    usar_carrinho = serializers.BooleanField(default=True, required=False)
    
    # Opção 2: Criar pedido com itens específicos (se usar_carrinho=False)
    itens = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField()),
        required=False,
        help_text="Lista de dicts com 'livro_id' e 'quantidade'"
    )
    
    # Endereço
    endereco_id = serializers.IntegerField(required=False, help_text="ID de endereço existente")
    endereco_novo = EnderecoSerializer(required=False, help_text="Dados para criar novo endereço")
    
    # Cupom de desconto (opcional)
    codigo_cupom = serializers.CharField(required=False, allow_blank=True, max_length=50)
    
    # Dados de frete
    tipo_frete = serializers.ChoiceField(
        choices=['SEDEX', 'PAC'],
        default='PAC',
        help_text="Tipo de frete escolhido"
    )
    valor_frete = serializers.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    prazo_entrega = serializers.IntegerField(default=7, help_text="Prazo de entrega em dias")
    
    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        usar_carrinho = attrs.get('usar_carrinho', True)
        
        # Validar que pelo menos uma opção de itens foi fornecida
        if usar_carrinho:
            # Verificar se o cliente tem carrinho
            request = self.context.get('request')
            if not request or not request.user.is_authenticated:
                raise serializers.ValidationError("Usuário não autenticado")
        else:
            # Validar que itens foram fornecidos
            if not attrs.get('itens'):
                raise serializers.ValidationError("Forneça 'itens' quando usar_carrinho=False")
        
        # Validar endereço
        if not attrs.get('endereco_id') and not attrs.get('endereco_novo'):
            raise serializers.ValidationError("Forneça 'endereco_id' ou 'endereco_novo'")
        
        if attrs.get('endereco_id') and attrs.get('endereco_novo'):
            raise serializers.ValidationError("Forneça apenas 'endereco_id' OU 'endereco_novo', não ambos")
        
        return attrs
    
    def create(self, validated_data: dict[str, Any]) -> Pedido:
        from django.utils import timezone
        from datetime import timedelta
       
       
        
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Usuário não autenticado")
        
        cliente = get_cliente_from_user(request.user)
        if not cliente:
            raise serializers.ValidationError("Cliente não encontrado")
        
        # 1. Processar endereço
        endereco_id = validated_data.get('endereco_id')
        endereco_novo_data = validated_data.get('endereco_novo')
        
        if endereco_id:
            try:
                endereco = Endereco.objects.get(pk=endereco_id)
            except Endereco.DoesNotExist:
                raise serializers.ValidationError({"endereco_id": "Endereço não encontrado"})
        else:
            # Criar novo endereço
            endereco_serializer = EnderecoSerializer(data=endereco_novo_data)
            endereco_serializer.is_valid(raise_exception=True)
            endereco = endereco_serializer.save()
        
        # 2. Processar cupom (se fornecido)
        cupom = None
        desconto_valor = 0.0
        codigo_cupom = validated_data.get('codigo_cupom', '').strip()
        
        if codigo_cupom:
            try:
                cupom = Cupom.objects.get(codigo=codigo_cupom, ativo=True)
                # Verificar validade
                if not cupom.get_validade:
                    raise serializers.ValidationError({"codigo_cupom": "Cupom expirado"})
            except Cupom.DoesNotExist:
                raise serializers.ValidationError({"codigo_cupom": "Cupom inválido"})
        
        # 3. Processar itens do pedido
        usar_carrinho = validated_data.get('usar_carrinho', True)
        itens_pedido = []
        valor_subtotal = 0.0
        quantia_itens = 0
        
        if usar_carrinho:
            # Pegar itens do carrinho do cliente
            try:
                carrinho = Carrinho.objects.get(cliente=cliente)
                itens_carrinho = carrinho.items_do_carrinho.all()
                
                if not itens_carrinho.exists():
                    raise serializers.ValidationError("Carrinho vazio")
                
                for item in itens_carrinho:
                    itens_pedido.append(item)
                    valor_subtotal += float(item.preco * item.quantidade)
                    quantia_itens += item.quantidade
                    
            except Carrinho.DoesNotExist:
                raise serializers.ValidationError("Carrinho não encontrado")
        else:
            # Criar itens a partir da lista fornecida
            itens_data = validated_data.get('itens', [])
            
            for item_data in itens_data:
                livro_id = item_data.get('livro_id')
                quantidade = item_data.get('quantidade', 1)
                
                try:
                    livro = Livro.objects.get(pk=livro_id)
                except Livro.DoesNotExist:
                    raise serializers.ValidationError(f"Livro com ID {livro_id} não encontrado")
                
                # Verificar estoque
                if livro.quantidade < quantidade:
                    raise serializers.ValidationError(
                        f"Estoque insuficiente para '{livro.titulo}'. Disponível: {livro.quantidade}"
                    )
                
                # Criar item do carrinho temporário
                item_carrinho = ItemCarrinho.objects.create(
                    livro=livro,
                    quantidade=quantidade,
                    preco=livro.preco
                )
                itens_pedido.append(item_carrinho)
                valor_subtotal += float(livro.preco * quantidade)
                quantia_itens += quantidade
        
        # 4. Calcular desconto
        if cupom:
            if cupom.tipo_valor == "1":  # Porcentagem
                desconto_valor = valor_subtotal * (cupom.valor / 100.0)
            else:  # Valor fixo
                desconto_valor = float(cupom.valor)
        
        # 5. Calcular valor total
        valor_frete = float(validated_data.get('valor_frete', 0.0))
        valor_total = valor_subtotal - desconto_valor + valor_frete
        
        # 6. Calcular datas
        prazo_entrega = validated_data.get('prazo_entrega', 7)
        data_pedido = timezone.now()
        entrega_estimada = data_pedido + timedelta(days=prazo_entrega)
        
        # 7. Criar pedido
        pedido = Pedido.objects.create(
            cliente=cliente,
            endereco=endereco,
            status='PRO',  # Processamento
            data_de_pedido=data_pedido,
            entrega_estimada=entrega_estimada,
            valor_total=valor_total,
            desconto=desconto_valor,
            quantia_itens=quantia_itens
        )
        
        # 8. Adicionar itens ao pedido
        pedido.itens.set(itens_pedido)
        
        # 9. Atualizar estoque dos livros
        for item in itens_pedido:
            livro = item.livro
            livro.quantidade -= item.quantidade
            livro.qtd_vendidos += item.quantidade
            livro.save()
        
        # 10. Limpar carrinho se foi usado
        if usar_carrinho:
            carrinho.items_do_carrinho.clear()
            carrinho.total = 0
            carrinho.save()
        
        return pedido


class UsuarioSerializer(serializers.ModelSerializer[Usuario]):
    foto_de_perfil_url = serializers.URLField(read_only=True)
    
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'username', 'nome', 'CPF', 'telefone', 'genero', 
                 'dt_nasc', 'date_joined', 'is_active', 'email_is_verified', 'foto_de_perfil_url']
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


class UsuarioUpdateSerializer(ImageKitUploadMixin, serializers.ModelSerializer[Usuario]):
    """Serializer para atualizar perfil do usuário com upload de foto para ImageKit"""
    foto_de_perfil = ImageKitImageField(required=False, allow_null=True, write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['email', 'username', 'nome', 'CPF', 'telefone', 'genero', 
                 'dt_nasc', 'foto_de_perfil']
    
    def update(self, instance: Usuario, validated_data: dict[str, Any]) -> Usuario:
        foto_file = validated_data.pop('foto_de_perfil', None)
        
        # Upload da nova foto para ImageKit (deleta a antiga automaticamente)
        if foto_file:
            upload_data = self.handle_imagekit_upload(
                image_file=foto_file,
                folder='perfis',
                instance=instance,
                url_field='foto_de_perfil_url',
                file_id_field='foto_de_perfil_file_id'
            )
            for field, value in upload_data.items():
                validated_data[field] = value
        
        return super().update(instance, validated_data)
    
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
    
    @extend_schema_field(OpenApiTypes.STR)
    def get_usuario_nome(self, obj: Avaliacao) -> str:
        """Retorna o nome do usuário"""
        return obj.usuario_nome
    
    usuario_nome = serializers.SerializerMethodField()
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


# ============================================
# SERIALIZERS DE FRETE
# ============================================

class CalcularFreteLivroSerializer(serializers.Serializer[dict[str, Any]]):
    """Serializer para entrada do cálculo de frete de um livro."""
    
    cep = serializers.CharField(
        max_length=9,
        min_length=8,
        help_text="CEP de destino (com ou sem hífen). Ex: 01310-100 ou 01310100"
    )
    quantidade = serializers.IntegerField(
        min_value=1,
        max_value=100,
        default=1,
        required=False,
        help_text="Quantidade de exemplares do livro"
    )


class CalcularFreteCarrinhoSerializer(serializers.Serializer[dict[str, Any]]):
    """Serializer para entrada do cálculo de frete do carrinho."""
    
    cep = serializers.CharField(
        max_length=9,
        min_length=8,
        help_text="CEP de destino (com ou sem hífen). Ex: 01310-100 ou 01310100"
    )


class OpcaoFreteSerializer(serializers.Serializer[dict[str, Any]]):
    """Serializer para uma opção de frete."""
    
    tipo = serializers.CharField(help_text="Tipo do frete: economico, padrao ou expresso")
    nome = serializers.CharField(help_text="Nome amigável do tipo de frete")
    preco = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Preço do frete em R$"
    )
    prazo_dias_min = serializers.IntegerField(help_text="Prazo mínimo em dias úteis")
    prazo_dias_max = serializers.IntegerField(help_text="Prazo máximo em dias úteis")
    descricao = serializers.CharField(help_text="Descrição da opção de frete")


class ResultadoFreteSerializer(serializers.Serializer[dict[str, Any]]):
    """Serializer para o resultado do cálculo de frete."""
    
    cep_destino = serializers.CharField(help_text="CEP de destino formatado")
    cep_valido = serializers.BooleanField(help_text="Indica se o CEP é válido")
    regiao = serializers.CharField(help_text="Região do Brasil identificada")
    peso_total_kg = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Peso total estimado em kg"
    )
    quantidade_itens = serializers.IntegerField(help_text="Quantidade total de itens")
    opcoes = OpcaoFreteSerializer(many=True, help_text="Opções de frete disponíveis")
    mensagem = serializers.CharField(
        allow_null=True,
        required=False,
        help_text="Mensagem adicional (frete grátis, erros, etc.)"
    )
