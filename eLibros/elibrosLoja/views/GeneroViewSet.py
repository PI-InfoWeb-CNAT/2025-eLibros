from rest_framework import viewsets, filters

from ..models import (
    Genero, 
)
from ..serializers import (
    GeneroSerializer
    )

class GeneroViewSet(viewsets.ModelViewSet[Genero]):
    """ViewSet para gerenciar gêneros"""
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering = ['nome']