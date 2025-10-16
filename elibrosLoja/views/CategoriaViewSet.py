from rest_framework import viewsets, filters

from ..models import (
    Categoria, 
)
from ..serializers import (
    CategoriaSerializer
    )

class CategoriaViewSet(viewsets.ModelViewSet[Categoria]):
    """ViewSet para gerenciar categorias"""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering = ['nome']