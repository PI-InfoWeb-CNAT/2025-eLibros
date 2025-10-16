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

# def remove_special_characters(text):
#   special_chars = re.compile(r'[^a-zA-Z0-9]')
#   return special_chars.sub('', text)


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
    
    @action(detail=False, methods=['GET'], permission_classes=[AllowAny])
    def lancamentos(self, request: Request) -> Response:
        """Retorna os últimos livros adicionados"""
        livros = Livro.objects.order_by('-ano_de_publicacao')[:8]
        serializer = self.get_serializer(livros, many=True)
        return Response(serializer.data)
