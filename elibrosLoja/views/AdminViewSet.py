from rest_framework import viewsets, status, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from django.contrib.auth import get_user_model
from accounts.models import Usuario
from ..models import Administrador, Cliente, Livro, Pedido, Genero, Categoria, Cupom
from ..serializers import (
    LivroSerializer, ClienteSerializer, GeneroSerializer, 
    CategoriaSerializer, PedidoSerializer
)
from ..utils import is_user_admin, get_administrador_from_user
from typing import Any, cast
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

User = get_user_model()

# Serializer simples para respostas administrativas
class AdminResponseSerializer(serializers.Serializer):
    """Serializer genérico para respostas administrativas"""
    message = serializers.CharField(required=False)
    error = serializers.CharField(required=False)

class AdminViewSet(viewsets.ViewSet):
    """
    ViewSet para operações administrativas
    Requer que o usuário seja staff ou superuser
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdminResponseSerializer  # Adicionar serializer_class padrão
    lookup_value_regex = '[0-9]+'  # Apenas números inteiros para pk
    
    # Definir um queryset vazio para ajudar o router a inferir tipos
    # Usamos o modelo Cliente como referência para os endpoints relacionados
    queryset = Cliente.objects.none()
    
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
            # Fazer casting do usuário para o tipo Usuario
            user = cast(Usuario, request.user)
            
            # Verificar se tem registro de Administrador
            admin_record = get_administrador_from_user(user)
            admin_info = None
            if admin_record:
                admin_info = {
                    'id': admin_record.pk,  # usar pk é mais seguro
                    'rg': admin_record.rg,
                }
            
            user_info = {
                'id': user.pk,
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
                        'id': order.pk,
                        'numero_pedido': order.numero_pedido,
                        'cliente_nome': order.cliente.user.nome,
                        'valor_total': str(order.valor_total),
                        'status': order.status,
                        'data_de_pedido': order.data_de_pedido,
                    }
                    for order in recent_orders
                ],
                'recent_clients': [
                    {
                        'id': client.pk,
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
                    'id': cliente.pk,
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
    
    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        responses={200: ClienteSerializer}
    )
    @action(detail=True, methods=['GET'])
    def get_cliente(self, request: Request, pk: int) -> Response:
        """Buscar cliente específico por ID"""
        try:
            cliente = Cliente.objects.select_related('user', 'endereco').get(pk=pk)
            
            cliente_data = {
                'id': cliente.pk,
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
    
    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        request=ClienteSerializer,
        responses={200: ClienteSerializer}
    )
    @action(detail=True, methods=['PUT', 'PATCH'])
    def editar_cliente(self, request: Request, pk: int) -> Response:
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
                        if field == 'numero':
                            # Tratar campo numero especialmente
                            if value == '' or value is None:
                                setattr(cliente.endereco, field, 1)  # s/n
                            else:
                                setattr(cliente.endereco, field, value)
                        elif field == 'uf':
                            setattr(cliente.endereco, field, value)
                        elif hasattr(cliente.endereco, field):
                            setattr(cliente.endereco, field, value)
                    cliente.endereco.save()
                else:
                    # Criar novo endereço
                    numero_value = endereco_data.get('numero')
                    if numero_value == '' or numero_value is None:
                        numero_value = 1  # Valor padrão para número (s/n)
                    
                    endereco = Endereco.objects.create(
                        cep=endereco_data.get('cep', ''),
                        rua=endereco_data.get('rua', ''),
                        numero=numero_value,
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
                'id': cliente.pk,
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
    
    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        responses={200: AdminResponseSerializer}
    )
    @action(detail=True, methods=['POST'])
    def toggle_cliente_status(self, request: Request, pk: int) -> Response:
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
    
    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        responses={200: AdminResponseSerializer}
    )
    @action(detail=True, methods=['DELETE'])
    def delete_cliente(self, request: Request, pk: int) -> Response:
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

    @action(detail=False, methods=['GET'])
    def pedidos(self, request: Request) -> Response:
        """Listar todos os pedidos para administradores"""
        try:
            # Filtros opcionais
            search = request.query_params.get('search', '')
            status_filter = request.query_params.get('status', '')
            ordering = request.query_params.get('ordering', '-data_de_pedido')
            
            # Query base - todos os pedidos para admins
            pedidos = Pedido.objects.select_related('cliente__user', 'endereco').prefetch_related('itens').all()
            
            # Aplicar filtros
            if search:
                pedidos = pedidos.filter(
                    numero_pedido__icontains=search
                ) | pedidos.filter(
                    cliente__user__nome__icontains=search
                ) | pedidos.filter(
                    cliente__user__email__icontains=search
                )
            
            if status_filter:
                # Mapear status do frontend para backend
                status_map = {
                    'pendente': 'PRO',
                    'confirmado': 'CON', 
                    'preparando': 'PRO',  # Assumindo que preparando é processamento
                    'enviado': 'ENV',
                    'entregue': 'ENT',
                    'cancelado': 'CAN'
                }
                backend_status = status_map.get(status_filter, status_filter)
                pedidos = pedidos.filter(status=backend_status)
            
            # Aplicar ordenação
            if ordering in ['-data_de_pedido', 'data_de_pedido', '-numero_pedido', 'numero_pedido']:
                pedidos = pedidos.order_by(ordering)
            else:
                pedidos = pedidos.order_by('-data_de_pedido')
            
            # Serializar dados no formato esperado pelo frontend
            pedidos_data = []
            for pedido in pedidos:
                # Mapear status do backend para frontend
                status_map_reverse = {
                    'PRO': 'pendente',
                    'CON': 'confirmado',
                    'ENV': 'enviado', 
                    'ENT': 'entregue',
                    'CAN': 'cancelado'
                }
                
                pedido_data = {
                    'id': pedido.pk,
                    'numero_pedido': pedido.numero_pedido,
                    'cliente': {
                        'id': pedido.cliente.pk,
                        'nome': pedido.cliente.user.nome,
                        'email': pedido.cliente.user.email,
                        'telefone': pedido.cliente.user.telefone if hasattr(pedido.cliente.user, 'telefone') else None
                    },
                    'endereco_entrega': {
                        'id': pedido.endereco.pk if pedido.endereco else None,
                        'nome': pedido.cliente.user.nome,  # Nome do cliente
                        'cep': pedido.endereco.cep if pedido.endereco else '',
                        'logradouro': pedido.endereco.rua if pedido.endereco else '',
                        'numero': pedido.endereco.numero if pedido.endereco else '',
                        'complemento': pedido.endereco.complemento if pedido.endereco else '',
                        'bairro': pedido.endereco.bairro if pedido.endereco else '',
                        'cidade': pedido.endereco.cidade if pedido.endereco else '',
                        'estado': pedido.endereco.uf if pedido.endereco else ''
                    } if pedido.endereco else None,
                    'status': status_map_reverse.get(pedido.status, 'pendente'),
                    'valor_subtotal': float(pedido.valor_total) - float(pedido.desconto or 0),
                    'valor_frete': 0.0,  # Assumindo que não há campo específico de frete
                    'valor_desconto': float(pedido.desconto or 0),
                    'valor_total': float(pedido.valor_total),
                    'data_pedido': pedido.data_de_pedido.isoformat() if pedido.data_de_pedido else None,
                    'data_atualizacao': pedido.data_de_pedido.isoformat() if pedido.data_de_pedido else None,  # Usando mesma data
                    'metodo_pagamento': 'Não informado',  # Campo não existe no modelo atual
                    'observacoes': '',  # Campo não existe no modelo atual
                    'cupom_usado': None,  # Implementar se necessário
                    'itens': [
                        {
                            'id': item.pk,
                            'livro': {
                                'id': item.livro.pk,
                                'titulo': item.livro.titulo,
                                'preco': float(item.preco),
                                'imagem_capa': item.livro.capa.url if item.livro.capa else None
                            },
                            'quantidade': item.quantidade,
                            'preco_unitario': float(item.preco),
                            'subtotal': float(item.preco * item.quantidade)
                        }
                        for item in pedido.itens.all()
                    ]
                }
                pedidos_data.append(pedido_data)
            
            # Formato de resposta esperado pelo frontend
            response_data = {
                'count': pedidos.count(),
                'next': None,
                'previous': None,
                'results': pedidos_data
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar pedidos: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        responses={200: PedidoSerializer}
    )
    @action(detail=True, methods=['GET'])
    def get_pedido(self, request: Request, pk: int) -> Response:
        """Buscar pedido específico por ID"""
        try:
            pedido = Pedido.objects.select_related('cliente__user', 'endereco').prefetch_related('itens').get(pk=pk)
            
            # Mapear status do backend para frontend
            status_map = {
                'PRO': 'pendente',
                'CON': 'confirmado',
                'ENV': 'enviado', 
                'ENT': 'entregue',
                'CAN': 'cancelado'
            }
            
            pedido_data = {
                'id': pedido.pk,
                'numero_pedido': pedido.numero_pedido,
                'cliente': {
                    'id': pedido.cliente.pk,
                    'nome': pedido.cliente.user.nome,
                    'email': pedido.cliente.user.email,
                    'telefone': pedido.cliente.user.telefone if hasattr(pedido.cliente.user, 'telefone') else None
                },
                'endereco_entrega': {
                    'id': pedido.endereco.pk if pedido.endereco else None,
                    'nome': pedido.cliente.user.nome,
                    'cep': pedido.endereco.cep if pedido.endereco else '',
                    'logradouro': pedido.endereco.rua if pedido.endereco else '',
                    'numero': pedido.endereco.numero if pedido.endereco else '',
                    'complemento': pedido.endereco.complemento if pedido.endereco else '',
                    'bairro': pedido.endereco.bairro if pedido.endereco else '',
                    'cidade': pedido.endereco.cidade if pedido.endereco else '',
                    'estado': pedido.endereco.uf if pedido.endereco else ''
                } if pedido.endereco else None,
                'status': status_map.get(pedido.status, 'pendente'),
                'valor_subtotal': float(pedido.valor_total) - float(pedido.desconto or 0),
                'valor_frete': 0.0,
                'valor_desconto': float(pedido.desconto or 0),
                'valor_total': float(pedido.valor_total),
                'data_pedido': pedido.data_de_pedido.isoformat() if pedido.data_de_pedido else None,
                'data_atualizacao': pedido.data_de_pedido.isoformat() if pedido.data_de_pedido else None,
                'metodo_pagamento': 'Não informado',
                'observacoes': '',
                'cupom_usado': None,
                'itens': [
                    {
                        'id': item.pk,
                        'livro': {
                            'id': item.livro.pk,
                            'titulo': item.livro.titulo,
                            'preco': float(item.preco),
                            'imagem_capa': item.livro.capa.url if item.livro.capa else None
                        },
                        'quantidade': item.quantidade,
                        'preco_unitario': float(item.preco),
                        'subtotal': float(item.preco * item.quantidade)
                    }
                    for item in pedido.itens.all()
                ]
            }
            
            return Response(pedido_data)
            
        except Pedido.DoesNotExist:
            return Response(
                {'error': 'Pedido não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar pedido: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        responses={200: AdminResponseSerializer}
    )
    @action(detail=True, methods=['PATCH'])
    def update_pedido_status(self, request: Request, pk: int) -> Response:
        """Atualizar status do pedido"""
        try:
            pedido = Pedido.objects.get(pk=pk)
            new_status = request.data.get('status')
            
            # Mapear status do frontend para backend
            status_map = {
                'pendente': 'PRO',
                'confirmado': 'CON',
                'preparando': 'PRO',
                'enviado': 'ENV',
                'entregue': 'ENT',
                'cancelado': 'CAN'
            }
            
            if not new_status:
                return Response({'error': 'Status é obrigatório'}, status=400)
                
            backend_status = status_map.get(str(new_status))
            if not backend_status:
                return Response({'error': 'Status inválido'}, status=400)
            
            pedido.status = backend_status
            
            # Se for cancelamento, definir data
            if backend_status == 'CAN':
                from django.utils import timezone
                pedido.data_de_cancelamento = timezone.now()
            
            pedido.save()
            
            return Response({'message': 'Status atualizado com sucesso'})
            
        except Pedido.DoesNotExist:
            return Response(
                {'error': 'Pedido não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao atualizar status: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        parameters=[OpenApiParameter(name='pk', type=OpenApiTypes.INT, location=OpenApiParameter.PATH)],
        responses={200: AdminResponseSerializer}
    )
    @action(detail=True, methods=['PATCH'])
    def cancelar_pedido_admin(self, request: Request, pk: int) -> Response:
        """Cancelar pedido (admin)"""
        try:
            pedido = Pedido.objects.get(pk=pk)
            motivo = request.data.get('motivo', '')
            
            if pedido.status not in ['ENV', 'ENT']:  # Não cancelar se já enviado/entregue
                from django.utils import timezone
                pedido.status = 'CAN'
                pedido.data_de_cancelamento = timezone.now()
                pedido.save()
                
                return Response({'message': f'Pedido cancelado. Motivo: {motivo}'})
            else:
                return Response({'error': 'Pedido não pode ser cancelado'}, status=400)
                
        except Pedido.DoesNotExist:
            return Response(
                {'error': 'Pedido não encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Erro ao cancelar pedido: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['GET'])
    def pedidos_estatisticas(self, request: Request) -> Response:
        """Estatísticas dos pedidos"""
        try:
            stats = {
                'total_pedidos': Pedido.objects.count(),
                'pedidos_pendentes': Pedido.objects.filter(status='PRO').count(),
                'pedidos_confirmados': Pedido.objects.filter(status='CON').count(),
                'pedidos_preparando': Pedido.objects.filter(status='PRO').count(),  # Assumindo mesmo que pendente
                'pedidos_enviados': Pedido.objects.filter(status='ENV').count(),
                'pedidos_entregues': Pedido.objects.filter(status='ENT').count(),
                'pedidos_cancelados': Pedido.objects.filter(status='CAN').count(),
                'valor_total_vendas': sum(float(p.valor_total) for p in Pedido.objects.filter(status__in=['CON', 'ENV', 'ENT']))
            }
            return Response(stats)
        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar estatísticas: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )