from typing import Any
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from django.db.models import QuerySet

from ..models import (
    Cliente, Pedido
)
from ..serializers import (
    PedidoSerializer
)


class PedidoViewSet(viewsets.ModelViewSet[Pedido]):
    """ViewSet para gerenciar pedidos - baseado na sua PedidoViews"""
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self) -> QuerySet[Pedido]:
        # Retorna apenas os pedidos do usuário logado
        if hasattr(self.request.user, 'cliente'):
            return Pedido.objects.filter(cliente=self.request.user.cliente)
        return Pedido.objects.none()

    @action(detail=False, methods=['get'])
    def meus_pedidos(self, request: Request) -> Response:
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
    def confirmar_recebimento(self, request: Request, pk: Any = None) -> Response:
        """Endpoint baseado na sua view confirmar_recebimento"""
        pedido = self.get_object()
        if pedido.status == 'ENV':
            pedido.status = 'ENT'
            pedido.save()
            return Response({'message': 'Recebimento confirmado'})
        return Response({'error': 'Pedido não pode ser confirmado'}, status=400)

    @action(detail=True, methods=['post'])
    def cancelar_pedido(self, request: Request, pk: Any = None) -> Response:
        """Endpoint baseado na sua view cancelar_pedido"""
        from django.utils import timezone
        pedido = self.get_object()
        if pedido.status not in ['ENV', 'ENT']:
            pedido.status = 'CAN'
            pedido.data_de_cancelamento = timezone.now()
            pedido.save()
            return Response({'message': 'Pedido cancelado'})
        return Response({'error': 'Pedido não pode ser cancelado'}, status=400)