from elibrosLoja.models import Livro, Categoria, Genero, Autor
from django.db.models import Q
# import re

from rest_framework.response import Response
from rest_framework import viewsets, status, filters, serializers
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from typing import Any, Type, cast


from ..serializers import (
    LivroSerializer, LivroCreateSerializer, GeneroSerializer, AutorSerializer, CategoriaSerializer
)
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes

# def remove_special_characters(text):
#   special_chars = re.compile(r'[^a-zA-Z0-9]')
#   return special_chars.sub('', text)


@extend_schema_view(
    list=extend_schema(
        tags=['Livros'],
        summary='Listar livros',
        description='Lista todos os livros disponíveis no catálogo com paginação'
    ),
    retrieve=extend_schema(
        tags=['Livros'],
        summary='Detalhes do livro',
        description='Retorna detalhes completos de um livro específico'
    ),
    create=extend_schema(
        tags=['Livros'],
        summary='Criar livro',
        description='Cria um novo livro no catálogo (requer autenticação de admin)'
    ),
    update=extend_schema(
        tags=['Livros'],
        summary='Atualizar livro',
        description='Atualiza todos os dados de um livro (requer autenticação de admin)'
    ),
    partial_update=extend_schema(
        tags=['Livros'],
        summary='Atualizar parcialmente livro',
        description='Atualiza alguns campos de um livro (requer autenticação de admin)'
    ),
    destroy=extend_schema(
        tags=['Livros'],
        summary='Deletar livro',
        description='Remove um livro do catálogo (requer autenticação de admin)'
    ),
)
class LivroViewSet(viewsets.ModelViewSet[Livro]):
    """ViewSet para gerenciar livros - baseado na sua LivroViews"""
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'genero', 'autor']
    search_fields = ['titulo', 'autor__nome', 'categoria__nome']
    ordering_fields = ['preco', 'ano_de_publicacao', 'titulo']
    ordering = ['-ano_de_publicacao']
    
    def get_serializer_class(self) -> Any:
        """Retorna a classe do serializer apropriada baseada na action"""
        if self.action in ['create', 'update', 'partial_update']:
            return LivroCreateSerializer
        return LivroSerializer
    
    def get_permissions(self) -> list[Any]:
        if self.action in ['list', 'retrieve', 'explorar', 'acervo', 'destaque', 'lancamentos']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @extend_schema(
        tags=['Livros'],
        summary='Explorar livros',
        description='Busca e filtra livros por título, autor, gênero e data de publicação',
        parameters=[
            OpenApiParameter(name='pesquisa', description='Termo de busca para título ou autor', type=OpenApiTypes.STR),
            OpenApiParameter(name='genero', description='Nome do gênero literário', type=OpenApiTypes.STR),
            OpenApiParameter(name='autor', description='Nome do autor', type=OpenApiTypes.STR),
            OpenApiParameter(name='data', description='Década de publicação ou "+" para livros recentes', type=OpenApiTypes.STR),
        ]
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def explorar(self, request: Request) -> Response:
        """Endpoint baseado na sua view explorar"""
        busca = request.query_params.get('pesquisa', '')
        genero = request.query_params.get('genero', '')
        autor = request.query_params.get('autor', '')
        data_publicacao = request.query_params.get('data', '')
        
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
        if data_publicacao:
            if data_publicacao == "+":
                livros = livros.filter(ano_de_publicacao__gt=2010)
            else:
                data_publicacao = int(data_publicacao)
                livros = livros.filter(
                    ano_de_publicacao__gte=data_publicacao,
                    ano_de_publicacao__lt=data_publicacao+10
                )
        
        serializer = self.get_serializer(livros, many=True)
        return Response({
            'livros': serializer.data,
            'generos': GeneroSerializer(Genero.objects.all(), many=True).data, # type: ignore
            'autores': AutorSerializer(Autor.objects.all(), many=True).data, # type: ignore
            'termo_pesquisa': busca,
        })

    @extend_schema(
        tags=['Livros'],
        summary='Acervo por categorias',
        description='Retorna livros organizados por categorias, gêneros e autores disponíveis'
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def acervo(self, request: Request) -> Response:
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

    @extend_schema(
        tags=['Livros'],
        summary='Livros em destaque',
        description='Retorna os livros em destaque (categoria "Indicações do eLibros") ou os mais vendidos'
    )
    @action(detail=False, methods=['GET'], permission_classes=[AllowAny])
    def destaque(self, request: Request) -> Response:
        """Retorna livros em destaque - usando categoria indicações"""
        try:
            categoria_destaque = Categoria.objects.get(nome__icontains='indicações')
            livros = Livro.objects.filter(categoria=categoria_destaque)[:8]
        except Categoria.DoesNotExist:
            # Fallback: pegar os mais vendidos
            livros = Livro.objects.order_by('-qtd_vendidos')[:8]
        
        serializer = self.get_serializer(livros, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        tags=['Livros'],
        summary='Últimos lançamentos',
        description='Retorna os últimos livros adicionados ao catálogo (ordenados por ano de publicação)'
    )
    @action(detail=False, methods=['GET'], permission_classes=[AllowAny])
    def lancamentos(self, request: Request) -> Response:
        """Retorna os últimos livros adicionados"""
        livros = Livro.objects.order_by('-ano_de_publicacao')[:8]
        serializer = self.get_serializer(livros, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        tags=['Livros'],
        summary='Upload de capa do livro',
        description='Faz upload da capa de um livro para o ImageKit.io (requer autenticação)',
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'capa': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Arquivo de imagem da capa'
                    }
                }
            }
        },
        responses={
            200: OpenApiResponse(description='Capa atualizada com sucesso'),
            400: OpenApiResponse(description='Nenhuma capa foi enviada'),
            500: OpenApiResponse(description='Erro ao fazer upload')
        }
    )
    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def upload_capa(self, request: Request, pk=None) -> Response:
        """
        Endpoint para upload de capa de livro via ImageKit.
        Recebe: capa (arquivo de imagem)
        """
        from utils.imagekit_config import upload_image_to_imagekit, delete_image_from_imagekit
        
        livro = self.get_object()
        capa = request.FILES.get('capa')
        
        if not capa:
            return Response({
                'error': 'Nenhuma capa foi enviada.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Deletar capa antiga se existir
        if livro.capa_file_id:
            delete_image_from_imagekit(livro.capa_file_id)
        
        # Upload da nova capa
        upload_result = upload_image_to_imagekit(
            file=capa,
            file_name=capa.name,
            folder='livros',
            tags=['capa', f'livro_{livro.id}', livro.ISBN] # type: ignore
        )
        
        if not upload_result:
            return Response({
                'error': 'Erro ao fazer upload da capa.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Atualizar livro
        livro.capa_url = upload_result['url']
        livro.capa_file_id = upload_result['file_id']
        livro.save()
        
        return Response({
            'message': 'Capa do livro atualizada com sucesso.',
            'capa_url': upload_result['url']
        }, status=status.HTTP_200_OK)
