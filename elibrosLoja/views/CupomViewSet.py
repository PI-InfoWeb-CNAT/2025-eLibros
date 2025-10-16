from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from elibrosLoja.models import Cupom, Administrador
from elibrosLoja.serializers import CupomSerializer
from ..utils import get_administrador_from_user, is_user_admin


class CupomViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar cupons
    Disponível apenas para administradores
    """
    queryset = Cupom.objects.all().order_by('codigo')
    serializer_class = CupomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """
        Verificar se o usuário é administrador (staff ou tem registro de Administrador)
        """
        if not self.request.user.is_authenticated:
            return [permissions.IsAuthenticated()]
        
        # Usar a função utilitária para verificar se é admin
        if not is_user_admin(self.request.user):
            return [permissions.IsAdminUser()]
        
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro por busca (código do cupom)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(codigo__icontains=search)
        
        # Filtro por status ativo
        ativo = self.request.query_params.get('ativo', None)
        if ativo is not None:
            queryset = queryset.filter(ativo=ativo.lower() == 'true')
        
        # Ordenação
        ordering = self.request.query_params.get('ordering', 'codigo')
        if ordering in ['codigo', '-codigo', 'data_inicio', '-data_inicio', 'valor', '-valor']:
            queryset = queryset.order_by(ordering)
        
        return queryset
    
    def perform_create(self, serializer):
        # Automaticamente definir o admin criador
        administrador = get_administrador_from_user(self.request.user)
        if administrador:
            serializer.save(criado_por=administrador)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """
        Retorna estatísticas dos cupons
        """
        queryset = self.get_queryset()
        
        stats = {
            'total_cupons': queryset.count(),
            'cupons_ativos': queryset.filter(ativo=True).count(),
            'cupons_inativos': queryset.filter(ativo=False).count(),
            'cupons_porcentagem': queryset.filter(tipo_valor='1').count(),
            'cupons_valor_fixo': queryset.filter(tipo_valor='2').count(),
        }
        
        return Response(stats)
    
    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        """
        Alterna o status ativo/inativo do cupom
        """
        cupom = self.get_object()
        cupom.ativo = not cupom.ativo
        cupom.save()
        
        serializer = self.get_serializer(cupom)
        return Response(serializer.data)