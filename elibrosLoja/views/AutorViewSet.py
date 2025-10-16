from rest_framework import viewsets, filters

from ..models import (
    Autor, 
)
from ..serializers import (
    AutorSerializer
    )

class AutorViewSet(viewsets.ModelViewSet[Autor]):
    """ViewSet para gerenciar autores"""
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nome']
    ordering = ['nome']