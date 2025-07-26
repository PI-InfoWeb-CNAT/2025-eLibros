from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Importar suas views existentes
from .views.LivroViews import LivroViews
from .views.CarrinhoViews import CarrinhoViews
from .views.ClienteViews import ClienteViews
from .views.PedidoViews import PedidoViews
from .views.AdminViews import AdminViews

from .models import (
    Livro, Autor, Categoria, Genero, Cliente,
    Carrinho, ItemCarrinho, Pedido, Cupom, Avaliacao, CurtidaAvaliacao
)
from .serializers import (
    LivroSerializer, LivroCreateSerializer, AutorSerializer,
    CategoriaSerializer, GeneroSerializer, ClienteSerializer,
    CarrinhoSerializer, ItemCarrinhoSerializer, PedidoSerializer,
    CupomSerializer, AvaliacaoSerializer, AvaliacaoCreateSerializer, 
    CurtidaAvaliacaoSerializer, EstatisticasLivroSerializer
)


# === API VIEWS BASEADAS NAS SUAS VIEWS EXISTENTES ===

class LivroViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar livros - baseado na sua LivroViews"""
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'genero', 'autor']
    search_fields = ['titulo', 'autor__nome', 'categoria__nome']
    ordering_fields = ['preco', 'ano_de_publicacao', 'titulo']
    ordering = ['-ano_de_publicacao']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LivroCreateSerializer
        return LivroSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def explorar(self, request):
        """Endpoint baseado na sua view explorar"""
        busca = request.query_params.get('pesquisa', '')
        genero = request.query_params.get('genero', '')
        autor = request.query_params.get('autor', '')
        data = request.query_params.get('data', '')
        
        livros = Livro.objects.all()
        
        if busca:
            from django.db.models import Q
            livros = livros.filter(
                Q(titulo__icontains=busca) |
                Q(autor__nome__icontains=busca)
            ).distinct()
        
        if genero:
            livros = livros.filter(genero__nome=genero)
        if autor:
            livros = livros.filter(autor__nome=autor)
        if data:
            if data == "+":
                livros = livros.filter(ano_de_publicacao__gt=2010)
            else:
                data = int(data)
                livros = livros.filter(
                    ano_de_publicacao__gte=data,
                    ano_de_publicacao__lt=data+10
                )
        
        serializer = self.get_serializer(livros, many=True)
        return Response({
            'livros': serializer.data,
            'generos': GeneroSerializer(Genero.objects.all(), many=True).data,
            'autores': AutorSerializer(Autor.objects.all(), many=True).data,
            'termo_pesquisa': busca,
        })

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def acervo(self, request):
        """Endpoint baseado na sua view acervo"""
        livros = Livro.objects.all()
        categorias = Categoria.objects.all()
        generos = Genero.objects.all()
        
        lista_livros = []
        for categoria in categorias:
            if livros.filter(categoria=categoria).exists():
                lista_livros.append({
                    'categoria': CategoriaSerializer(categoria).data,
                    'livros': LivroSerializer(livros.filter(categoria=categoria), many=True).data,
                })
        
        return Response({
            'lista_livros': lista_livros,
            'generos': GeneroSerializer(generos, many=True).data,
            'autores': AutorSerializer(Autor.objects.all(), many=True).data,
        })


class AutorViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar autores"""
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering = ['nome']


class CategoriaViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar categorias"""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering = ['nome']


class GeneroViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar gêneros"""
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering = ['nome']


class CarrinhoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar carrinho - baseado na sua CarrinhoViews"""
    serializer_class = CarrinhoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Retorna apenas o carrinho do usuário logado
        if hasattr(self.request.user, 'cliente'):
            return Carrinho.objects.filter(cliente=self.request.user.cliente)
        return Carrinho.objects.none()
    
    @action(detail=False, methods=['post'])
    def atualizar_carrinho(self, request):
        """Endpoint baseado na sua view atualizar_carrinho"""
        try:
            id_item = request.data.get('id')
            action = request.data.get('action')
            quantidade = request.data.get('quantidadeAdicionada', 1)
            
            if request.user.is_authenticated:
                cliente = Cliente.objects.get(user=request.user)
                carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
            else:
                return Response({'error': 'Usuário não autenticado'}, status=401)
            
            if action in ['adicionarAoCarrinho', 'comprarAgora']:
                livro = Livro.objects.get(id=id_item)
                item_carrinho, item_created = ItemCarrinho.objects.get_or_create(
                    livro=livro,
                    carrinho=carrinho,
                    defaults={'quantidade': int(quantidade), 'preco': livro.preco}
                )
                
                if not item_created:
                    item_carrinho.quantidade += int(quantidade)
                
                item_carrinho.save()
                message = 'Item foi adicionado ao carrinho'
                
            elif action == 'deletar':
                item_carrinho = ItemCarrinho.objects.get(id=id_item)
                item_carrinho.delete()
                message = 'Item removido do carrinho'
            
            cart_item_count = carrinho.numero_itens
            return Response({
                'message': message, 
                'cartItemCount': cart_item_count
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=False, methods=['post'])
    def aplicar_cupom(self, request):
        """Endpoint baseado na sua view aplicar_cupom"""
        codigo_cupom = request.data.get('codigo_cupom')
        try:
            cupom = Cupom.objects.get(codigo=codigo_cupom, ativo=True)
            if not cupom.get_validade:
                return Response({'error': 'Cupom expirado'}, status=400)
            
            # Lógica de desconto (adaptar conforme seu modelo)
            return Response({
                'cupom': CupomSerializer(cupom).data,
                'message': 'Cupom aplicado com sucesso'
            })
            
        except Cupom.DoesNotExist:
            return Response({'error': 'Cupom inválido ou expirado'}, status=400)


class PedidoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar pedidos - baseado na sua PedidoViews"""
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Retorna apenas os pedidos do usuário logado
        if hasattr(self.request.user, 'cliente'):
            return Pedido.objects.filter(cliente=self.request.user.cliente)
        return Pedido.objects.none()

    @action(detail=False, methods=['get'])
    def meus_pedidos(self, request):
        """Endpoint baseado na sua view pedidos"""
        cliente = Cliente.objects.get(user=request.user)
        pedidos = Pedido.objects.filter(cliente=cliente)
        
        pedidos_data = {
            'andamento': [],
            'enviados': [],
            'finalizados': [],
            'cancelados': []
        }
        
        for pedido in pedidos:
            pedido_serialized = PedidoSerializer(pedido).data
            if pedido.status == 'ENT':
                pedidos_data['finalizados'].append(pedido_serialized)
            elif pedido.status == 'ENV':
                pedidos_data['enviados'].append(pedido_serialized)
            elif pedido.status == 'CAN':
                pedidos_data['cancelados'].append(pedido_serialized)
            else:
                pedidos_data['andamento'].append(pedido_serialized)
        
        return Response(pedidos_data)

    @action(detail=True, methods=['post'])
    def confirmar_recebimento(self, request, pk=None):
        """Endpoint baseado na sua view confirmar_recebimento"""
        pedido = self.get_object()
        if pedido.status == 'ENV':
            pedido.status = 'ENT'
            pedido.save()
            return Response({'message': 'Recebimento confirmado'})
        return Response({'error': 'Pedido não pode ser confirmado'}, status=400)

    @action(detail=True, methods=['post'])
    def cancelar_pedido(self, request, pk=None):
        """Endpoint baseado na sua view cancelar_pedido"""
        from django.utils import timezone
        pedido = self.get_object()
        if pedido.status not in ['ENV', 'ENT']:
            pedido.status = 'CAN'
            pedido.data_de_cancelamento = timezone.now()
            pedido.save()
            return Response({'message': 'Pedido cancelado'})
        return Response({'error': 'Pedido não pode ser cancelado'}, status=400)


class ClienteViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar cliente - baseado na sua ClienteViews"""
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Retorna apenas o cliente do usuário logado
        if hasattr(self.request.user, 'cliente'):
            return Cliente.objects.filter(user=self.request.user)
        return Cliente.objects.none()

    @action(detail=False, methods=['get'])
    def perfil(self, request):
        """Endpoint baseado na sua view perfil"""
        try:
            cliente = Cliente.objects.get(user=request.user)
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente não encontrado'}, status=404)

    @action(detail=False, methods=['put'])
    def editar_perfil(self, request):
        """Endpoint baseado na sua view editar_perfil"""
        try:
            cliente = Cliente.objects.get(user=request.user)
            
            # Atualizar dados do usuário
            user_data = request.data.get('user', {})
            if 'username' in user_data:
                cliente.user.username = user_data['username']
            if 'email' in user_data:
                cliente.user.email = user_data['email']
            if 'telefone' in user_data:
                cliente.user.telefone = user_data['telefone']
            if 'genero' in user_data:
                cliente.user.genero = user_data['genero']
            
            # Atualizar endereço
            endereco_data = request.data.get('endereco', {})
            if endereco_data:
                from .models import Endereco
                endereco, created = Endereco.objects.update_or_create(
                    cep=endereco_data.get('cep'),
                    defaults={
                        'rua': endereco_data.get('rua', ''),
                        'numero': endereco_data.get('numero', ''),
                        'complemento': endereco_data.get('complemento', ''),
                        'cidade': endereco_data.get('cidade', ''),
                        'uf': endereco_data.get('estado', ''),
                        'bairro': endereco_data.get('bairro', '')
                    }
                )
                cliente.endereco = endereco
            
            cliente.user.save()
            cliente.save()
            
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data)
            
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente não encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


# === ENDPOINTS PERSONALIZADOS ===

@api_view(['GET'])
@permission_classes([AllowAny])
def inicio(request):
    """Endpoint baseado na sua view Inicio"""
    livros = Livro.objects.all()
    generos = Genero.objects.all()
    
    # Buscar livros indicações (adaptar conforme sua lógica)
    try:
        categoria_indicacoes = Categoria.objects.get(nome='Indicações do eLibros')
        livros_indicacoes = livros.filter(categoria=categoria_indicacoes)
    except Categoria.DoesNotExist:
        livros_indicacoes = livros[:8]  # Fallback para os primeiros 8
    
    return Response({
        'livros_indicacoes': LivroSerializer(livros_indicacoes, many=True).data,
        'generos': GeneroSerializer(generos, many=True).data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def livros_destaque(request):
    """Retorna livros em destaque - usando categoria indicações"""
    try:
        categoria_destaque = Categoria.objects.get(nome__icontains='indicações')
        livros = Livro.objects.filter(categoria=categoria_destaque)[:8]
    except Categoria.DoesNotExist:
        # Fallback: pegar os mais vendidos
        livros = Livro.objects.order_by('-qtd_vendidos')[:8]
    
    serializer = LivroSerializer(livros, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def livros_lancamentos(request):
    """Retorna os últimos livros adicionados"""
    livros = Livro.objects.order_by('-ano_de_publicacao')[:8]
    serializer = LivroSerializer(livros, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def estatisticas(request):
    """Retorna estatísticas básicas da loja"""
    stats = {
        'total_livros': Livro.objects.count(),
        'total_autores': Autor.objects.count(),
        'total_categorias': Categoria.objects.count(),
        'total_generos': Genero.objects.count(),
    }
    return Response(stats)


# === VIEWS DE AVALIAÇÕES ===

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])  # GET é público, POST precisa de autenticação
def avaliacoes_livro(request, livro_id):
    """
    GET: Lista avaliações de um livro
    POST: Cria nova avaliação (requer autenticação)
    """
    livro = get_object_or_404(Livro, id=livro_id)
    
    if request.method == 'GET':
        avaliacoes = Avaliacao.objects.filter(livro=livro).select_related('usuario')
        serializer = AvaliacaoSerializer(avaliacoes, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Autenticação necessária para avaliar'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Verificar se usuário já avaliou este livro
        if Avaliacao.objects.filter(usuario=request.user, livro=livro).exists():
            return Response(
                {'detail': 'Você já avaliou este livro'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AvaliacaoCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        if serializer.is_valid():
            avaliacao = serializer.save(livro=livro)
            response_serializer = AvaliacaoSerializer(avaliacao, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def curtir_avaliacao(request, avaliacao_id):
    """
    POST: Curtir uma avaliação
    DELETE: Remover curtida
    """
    avaliacao = get_object_or_404(Avaliacao, id=avaliacao_id)
    
    # Usuário não pode curtir própria avaliação
    if avaliacao.usuario == request.user:
        return Response(
            {'detail': 'Você não pode curtir sua própria avaliação'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    curtida_existe = CurtidaAvaliacao.objects.filter(
        usuario=request.user, 
        avaliacao=avaliacao
    ).first()
    
    if request.method == 'POST':
        if curtida_existe:
            return Response(
                {'detail': 'Você já curtiu esta avaliação'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        CurtidaAvaliacao.objects.create(usuario=request.user, avaliacao=avaliacao)
        
        # Atualizar contador de curtidas
        avaliacao.curtidas = avaliacao.curtidas_usuarios.count()
        avaliacao.save(update_fields=['curtidas'])
        
        return Response({'detail': 'Avaliação curtida com sucesso'})
    
    elif request.method == 'DELETE':
        if not curtida_existe:
            return Response(
                {'detail': 'Você não curtiu esta avaliação'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        curtida_existe.delete()
        
        # Atualizar contador de curtidas
        avaliacao.curtidas = avaliacao.curtidas_usuarios.count()
        avaliacao.save(update_fields=['curtidas'])
        
        return Response({'detail': 'Curtida removida com sucesso'})
