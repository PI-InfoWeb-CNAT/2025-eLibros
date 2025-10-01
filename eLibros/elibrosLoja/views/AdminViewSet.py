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
    
    @action(detail=False, methods=['GET'])
    def clientes(self, request: Request) -> Response:
        """Listar todos os clientes para administradores"""
        try:
            clientes = Cliente.objects.select_related('user', 'endereco').all()
            
            clientes_data = []
            for cliente in clientes:
                cliente_data = {
                    'id': cliente.id,
                    'nome': cliente.user.nome,
                    'email': cliente.user.email,
                    'username': cliente.user.username,
                    'cpf': cliente.user.CPF,
                    'telefone': cliente.user.telefone,
                    'data_nascimento': cliente.user.dt_nasc,
                    'genero': cliente.user.genero,
                    'data_cadastro': cliente.user.date_joined,
                    'is_active': cliente.user.is_active,
                    'foto_de_perfil': cliente.user.foto_de_perfil.url if cliente.user.foto_de_perfil else None,
                }
                
                if cliente.endereco:
                    cliente_data['endereco'] = {
                        'id': cliente.endereco.id,
                        'cep': cliente.endereco.cep,
                        'rua': cliente.endereco.rua,
                        'numero': cliente.endereco.numero,
                        'complemento': cliente.endereco.complemento,
                        'bairro': cliente.endereco.bairro,
                        'cidade': cliente.endereco.cidade,
                        'uf': cliente.endereco.uf,
                    }
                else:
                    cliente_data['endereco'] = None
                
                clientes_data.append(cliente_data)
            
            return Response(clientes_data)
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar clientes: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['GET'])
    def get_cliente(self, request: Request, pk=None) -> Response:
        """Buscar cliente específico por ID"""
        try:
            cliente = Cliente.objects.select_related('user', 'endereco').get(pk=pk)
            
            cliente_data = {
                'id': cliente.id,
                'nome': cliente.user.nome,
                'email': cliente.user.email,
                'username': cliente.user.username,
                'cpf': cliente.user.CPF,
                'telefone': cliente.user.telefone,
                'data_nascimento': cliente.user.dt_nasc,
                'genero': cliente.user.genero,
                'data_cadastro': cliente.user.date_joined,
                'is_active': cliente.user.is_active,
                'foto_de_perfil': cliente.user.foto_de_perfil.url if cliente.user.foto_de_perfil else None,
            }
            
            if cliente.endereco:
                cliente_data['endereco'] = {
                    'id': cliente.endereco.id,
                    'cep': cliente.endereco.cep,
                    'rua': cliente.endereco.rua,
                    'numero': cliente.endereco.numero,
                    'complemento': cliente.endereco.complemento,
                    'bairro': cliente.endereco.bairro,
                    'cidade': cliente.endereco.cidade,
                    'uf': cliente.endereco.uf,
                }
            else:
                cliente_data['endereco'] = None
            
            return Response(cliente_data)
        except Cliente.DoesNotExist:
            return Response(
                {'error': 'Cliente não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar cliente: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['PUT', 'PATCH'])
    def editar_cliente(self, request: Request, pk=None) -> Response:
        """Editar dados do cliente"""
        try:
            cliente = Cliente.objects.select_related('user', 'endereco').get(pk=pk)
            
            # Atualizar dados do usuário
            user_data = request.data.get('user', {})
            if 'nome' in user_data:
                cliente.user.nome = user_data['nome']
            if 'email' in user_data:
                cliente.user.email = user_data['email']
            if 'username' in user_data:
                cliente.user.username = user_data['username']
            if 'cpf' in user_data or 'CPF' in user_data:
                cliente.user.CPF = user_data.get('cpf', user_data.get('CPF'))
            if 'telefone' in user_data:
                cliente.user.telefone = user_data['telefone']
            if 'genero' in user_data:
                cliente.user.genero = user_data['genero']
            if 'dt_nasc' in user_data:
                cliente.user.dt_nasc = user_data['dt_nasc']
            
            # Atualizar foto de perfil se fornecida
            if 'foto_de_perfil' in request.FILES:
                cliente.user.foto_de_perfil = request.FILES['foto_de_perfil']
            
            # Atualizar endereço
            endereco_data = request.data.get('endereco', {})
            if endereco_data:
                from ..models import Endereco
                if cliente.endereco:
                    # Atualizar endereço existente
                    for field, value in endereco_data.items():
                        if field == 'uf':
                            setattr(cliente.endereco, field, value)
                        elif hasattr(cliente.endereco, field):
                            setattr(cliente.endereco, field, value)
                    cliente.endereco.save()
                else:
                    # Criar novo endereço
                    endereco = Endereco.objects.create(
                        cep=endereco_data.get('cep', ''),
                        rua=endereco_data.get('rua', ''),
                        numero=endereco_data.get('numero', ''),
                        complemento=endereco_data.get('complemento', ''),
                        cidade=endereco_data.get('cidade', ''),
                        uf=endereco_data.get('uf', ''),
                        bairro=endereco_data.get('bairro', '')
                    )
                    cliente.endereco = endereco
            
            cliente.user.save()
            cliente.save()
            
            # Retornar dados atualizados
            cliente_data = {
                'id': cliente.id,
                'nome': cliente.user.nome,
                'email': cliente.user.email,
                'username': cliente.user.username,
                'cpf': cliente.user.CPF,
                'telefone': cliente.user.telefone,
                'data_nascimento': cliente.user.dt_nasc,
                'genero': cliente.user.genero,
                'data_cadastro': cliente.user.date_joined,
                'is_active': cliente.user.is_active,
                'foto_de_perfil': cliente.user.foto_de_perfil.url if cliente.user.foto_de_perfil else None,
            }
            
            if cliente.endereco:
                cliente_data['endereco'] = {
                    'id': cliente.endereco.id,
                    'cep': cliente.endereco.cep,
                    'rua': cliente.endereco.rua,
                    'numero': cliente.endereco.numero,
                    'complemento': cliente.endereco.complemento,
                    'bairro': cliente.endereco.bairro,
                    'cidade': cliente.endereco.cidade,
                    'uf': cliente.endereco.uf,
                }
            else:
                cliente_data['endereco'] = None
            
            return Response(cliente_data)
            
        except Cliente.DoesNotExist:
            return Response(
                {'error': 'Cliente não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao editar cliente: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['POST'])
    def toggle_cliente_status(self, request: Request, pk=None) -> Response:
        """Ativar/desativar cliente"""
        try:
            cliente = Cliente.objects.get(pk=pk)
            cliente.user.is_active = not cliente.user.is_active
            cliente.user.save()
            
            return Response({
                'message': f'Cliente {"ativado" if cliente.user.is_active else "desativado"} com sucesso',
                'is_active': cliente.user.is_active
            })
        except Cliente.DoesNotExist:
            return Response(
                {'error': 'Cliente não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao alterar status do cliente: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['DELETE'])
    def delete_cliente(self, request: Request, pk=None) -> Response:
        """Excluir cliente"""
        try:
            cliente = Cliente.objects.get(pk=pk)
            nome_cliente = cliente.user.nome
            
            # Excluir o usuário também exclui o cliente (cascata)
            cliente.user.delete()
            
            return Response({
                'message': f'Cliente "{nome_cliente}" excluído com sucesso'
            })
        except Cliente.DoesNotExist:
            return Response(
                {'error': 'Cliente não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao excluir cliente: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )