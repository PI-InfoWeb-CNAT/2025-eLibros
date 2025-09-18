from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from django.contrib.auth import get_user_model
from ..models import Administrador, Cliente, Livro, Pedido, Genero, Categoria, Cupom
from ..serializers import (
    LivroSerializer, ClienteSerializer, GeneroSerializer, 
    CategoriaSerializer, PedidoSerializer
)
from typing import Any

User = get_user_model()

class AdminViewSet(viewsets.ViewSet):
    """
    ViewSet para operações administrativas
    Requer que o usuário seja staff ou superuser
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """
        Verificar se o usuário é administrador (staff ou tem registro de Administrador)
        """
        if not self.request.user.is_authenticated:
            return [permissions.IsAuthenticated()]
        
        # Verificar se é staff/superuser OU tem registro de Administrador
        is_admin = (
            self.request.user.is_staff or 
            self.request.user.is_superuser or
            Administrador.objects.filter(user=self.request.user).exists()
        )
        
        if not is_admin:
            return [permissions.IsAdminUser()]
        
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['GET'])
    def dashboard_stats(self, request: Request) -> Response:
        """Estatísticas do dashboard administrativo"""
        try:
            stats = {
                'total_livros': Livro.objects.count(),
                'total_clientes': Cliente.objects.count(),
                'total_pedidos': Pedido.objects.count(),
                'total_generos': Genero.objects.count(),
                'total_categorias': Categoria.objects.count(),
                'total_administradores': Administrador.objects.count(),
            }
            return Response(stats)
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar estatísticas: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['GET'])
    def user_info(self, request: Request) -> Response:
        """Informações do usuário administrador atual"""
        try:
            user = request.user
            
            # Verificar se tem registro de Administrador
            try:
                admin_record = Administrador.objects.get(user=user)
                admin_info = {
                    'id': admin_record.id,
                    'rg': admin_record.rg,
                }
            except Administrador.DoesNotExist:
                admin_info = None
            
            user_info = {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'nome': user.nome,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined,
                'admin_record': admin_info
            }
            
            return Response(user_info)
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar informações do usuário: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['GET'])
    def recent_activities(self, request: Request) -> Response:
        """Atividades recentes para o dashboard"""
        try:
            # Últimos 5 pedidos
            recent_orders = Pedido.objects.select_related('cliente__user').order_by('-data_pedido')[:5]
            
            # Últimos 5 clientes cadastrados
            recent_clients = Cliente.objects.select_related('user').order_by('-user__date_joined')[:5]
            
            activities = {
                'recent_orders': [
                    {
                        'id': order.id,
                        'numero_pedido': order.numero_pedido,
                        'cliente_nome': order.cliente.user.nome,
                        'valor_total': str(order.valor_total),
                        'status': order.status,
                        'data_pedido': order.data_pedido,
                    }
                    for order in recent_orders
                ],
                'recent_clients': [
                    {
                        'id': client.id,
                        'nome': client.user.nome,
                        'email': client.user.email,
                        'data_cadastro': client.user.date_joined,
                    }
                    for client in recent_clients
                ]
            }
            
            return Response(activities)
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar atividades recentes: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )