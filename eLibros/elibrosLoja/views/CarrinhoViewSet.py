from typing import Any
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.request import Request

from ..models import (
    Carrinho, Livro, Cliente, ItemCarrinho, Cupom
)
from ..serializers import (
    CarrinhoSerializer,
    LivroSerializer,
    ClienteSerializer,
    ItemCarrinhoSerializer,
    CupomSerializer
)


class CarrinhoViewSet(viewsets.ModelViewSet[Carrinho]):
    """ViewSet para gerenciar carrinho - baseado na sua CarrinhoViews"""
    serializer_class = CarrinhoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self) -> Any:
        # Retorna apenas o carrinho do usuário logado
        if hasattr(self.request.user, 'cliente'):
            return Carrinho.objects.filter(cliente=self.request.user.cliente)
        return Carrinho.objects.none()
    
    @action(detail=False, methods=['post'])
    def atualizar_carrinho(self, request: Request) -> Response:
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
    def aplicar_cupom(self, request: Request) -> Response:
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
