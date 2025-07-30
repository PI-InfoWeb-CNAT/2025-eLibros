from .AutorViewSet import AutorViewSet
from .AvaliacaoViewSet import AvaliacaoViewSet
from .CarrinhoViewSet import CarrinhoViewSet
from .CategoriaViewSet import CategoriaViewSet
from .ClienteViewSet import ClienteViewSet
from .GeneroViewSet import GeneroViewSet
from .LivroViewSet import LivroViewSet
from .PedidoViewSet import PedidoViewSet

from ..serializers import (
    GeneroSerializer,
    LivroSerializer
    )

from ..models import (
    Livro, Genero, Categoria, Autor
    )

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny 
from rest_framework.request import Request


'''
permissoes_admin_elibros = {
        'livro': ['c', 'r', 'u', 'd'],
        'pedido': ['r', 'u', 'd'],
        'cliente': ['r', 'u', 'd'],
        'genero': ['c', 'r', 'd'],
        'categoria': ['c', 'r', 'd'],
        'endereco': ['c', 'r', 'u', 'd'],
        }
    
    fields_exclude = {
        'livro': ['id', 'historico', 'criado_por', 'livro_selecionado', 'capa'],
        'genero': ['id'],
        'categoria': ['id'],
        'cliente': ['id, criado_por, historico'],
        'pedido': ['id, criado_por, historico'],
        'cupom': ['id'],
    }
'''

@api_view(['GET'])
@permission_classes([AllowAny])
def inicio(request: Request) -> Response:
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
def estatisticas(request: Request) -> Response:
    """Retorna estatísticas básicas da loja"""
    stats = {
        'total_livros': Livro.objects.count(),
        'total_autores': Autor.objects.count(),
        'total_categorias': Categoria.objects.count(),
        'total_generos': Genero.objects.count(),
    }
    return Response(stats)

