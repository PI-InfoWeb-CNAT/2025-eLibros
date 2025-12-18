from typing import Any
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from django.db.models import QuerySet
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiTypes

from ..models import (
    Cliente, Pedido
)
from ..serializers import (
    PedidoSerializer, PedidoCreateSerializer
)
from ..utils import get_cliente_from_user


@extend_schema_view(
    create=extend_schema(
        tags=['Pedidos'],
        summary='Criar novo pedido',
        description="""
        Cria um novo pedido a partir do carrinho do usuário ou de itens específicos.
        
        **Opção 1: Usar carrinho existente (padrão)**
        ```json
        {
          "usar_carrinho": true,
          "endereco_id": 1,
          "codigo_cupom": "DESCONTO10",
          "tipo_frete": "PAC",
          "valor_frete": 15.00,
          "prazo_entrega": 7
        }
        ```
        
        **Opção 2: Criar pedido com itens específicos**
        ```json
        {
          "usar_carrinho": false,
          "itens": [
            {"livro_id": 1, "quantidade": 2},
            {"livro_id": 5, "quantidade": 1}
          ],
          "endereco_novo": {
            "cep": "12345-678",
            "rua": "Rua Example",
            "numero": 123,
            "bairro": "Centro",
            "cidade": "São Paulo",
            "uf": "SP"
          },
          "tipo_frete": "SEDEX",
          "valor_frete": 25.00,
          "prazo_entrega": 3
        }
        ```
        """
    ),
    list=extend_schema(
        tags=['Pedidos'],
        summary='Listar pedidos do usuário',
        description='Retorna todos os pedidos do usuário autenticado'
    ),
    retrieve=extend_schema(
        tags=['Pedidos'],
        summary='Detalhes do pedido',
        description='Retorna detalhes completos de um pedido específico'
    ),
)
class PedidoViewSet(viewsets.ModelViewSet[Pedido]):
    """ViewSet para gerenciar pedidos - baseado na sua PedidoViews"""
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]
    lookup_value_regex = '[0-9]+'  # Apenas números inteiros para pk
    
    def get_serializer_class(self):
        """Usar PedidoCreateSerializer para criar pedidos"""
        if self.action == 'create':
            return PedidoCreateSerializer
        return PedidoSerializer
    
    def get_queryset(self) -> QuerySet[Pedido]:
        # Retorna apenas os pedidos do usuário logado
        cliente = get_cliente_from_user(self.request.user)
        if cliente:
            return Pedido.objects.filter(cliente=cliente)
        return Pedido.objects.none()

    @action(detail=False, methods=['get'])
    def meus_pedidos(self, request: Request) -> Response:
        """Endpoint baseado na sua view pedidos"""
        cliente = get_cliente_from_user(request.user)
        if not cliente:
            return Response({'error': 'Cliente não encontrado'}, status=404)
            
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