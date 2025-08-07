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
        else:
            # Se o usuário não tem Cliente associado, criar um
            try:
                cliente, created = Cliente.objects.get_or_create(user=self.request.user)
                if created:
                    print(f"Cliente criado automaticamente para o usuário: {self.request.user}")
                return Carrinho.objects.filter(cliente=cliente)
            except Exception as e:
                print(f"Erro ao criar Cliente: {e}")
                return Carrinho.objects.none()
    
    @action(detail=False, methods=['post'])
    def atualizar_carrinho(self, request: Request) -> Response:
        """Endpoint baseado na sua view atualizar_carrinho"""
        try:
            # Novos parâmetros do frontend
            livro_id = request.data.get('livro_id')
            item_id = request.data.get('item_id')
            acao = request.data.get('acao')
            quantidade = request.data.get('quantidade', 1)
            
            # Parâmetros antigos para compatibilidade
            id_item = request.data.get('id') or livro_id or item_id
            action = request.data.get('action') or acao
            quantidadeAdicionada = request.data.get('quantidadeAdicionada') or quantidade
            
            if request.user.is_authenticated:
                # Criar Cliente se não existir
                cliente, created = Cliente.objects.get_or_create(user=request.user)
                if created:
                    print(f"Cliente criado automaticamente para o usuário: {request.user}")
                
                carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
            else:
                return Response({'error': 'Usuário não autenticado'}, status=401)
            
            if action in ['adicionarAoCarrinho', 'comprarAgora', 'adicionar']:
                livro = Livro.objects.get(id=id_item)
                item_carrinho, item_created = ItemCarrinho.objects.get_or_create(
                    livro=livro,
                    carrinho=carrinho,
                    defaults={'quantidade': int(quantidadeAdicionada), 'preco': livro.preco}
                )
                
                if not item_created:
                    item_carrinho.quantidade += int(quantidadeAdicionada)
                
                item_carrinho.save()
                message = 'Item foi adicionado ao carrinho'
                
            elif action in ['deletar', 'remover']:
                if item_id:
                    # Remover por ID do item do carrinho
                    item_carrinho = ItemCarrinho.objects.get(id=item_id, carrinho=carrinho)
                else:
                    # Remover por ID do livro
                    item_carrinho = ItemCarrinho.objects.get(livro__id=id_item, carrinho=carrinho)
                item_carrinho.delete()
                message = 'Item removido do carrinho'
                
            elif action in ['atualizar']:
                if item_id:
                    # Atualizar por ID do item do carrinho
                    item_carrinho = ItemCarrinho.objects.get(id=item_id, carrinho=carrinho)
                    item_carrinho.quantidade = int(quantidadeAdicionada)
                    item_carrinho.save()
                    message = 'Quantidade atualizada'
                else:
                    return Response({'error': 'ID do item é necessário para atualização'}, status=400)
                    
            elif action in ['limpar']:
                # Limpar todo o carrinho
                ItemCarrinho.objects.filter(carrinho=carrinho).delete()
                message = 'Carrinho limpo'
            
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
