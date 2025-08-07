from typing import Any
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from django.db.models import QuerySet

from ..models import (
    Cliente
)
from ..serializers import (
    ClienteSerializer
)


class ClienteViewSet(viewsets.ModelViewSet[Cliente]):
    """ViewSet para gerenciar cliente - baseado na sua ClienteViews"""
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self) -> QuerySet[Cliente]:
        # Retorna apenas o cliente do usuário logado
        if hasattr(self.request.user, 'cliente'):
            return Cliente.objects.filter(user=self.request.user)
        return Cliente.objects.none()

    @action(detail=False, methods=['get'])
    def perfil(self, request: Request) -> Response:
        """Endpoint baseado na sua view perfil"""
        try:
            cliente = Cliente.objects.get(user=request.user)
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente não encontrado'}, status=404)

    @action(detail=False, methods=['put'])
    def editar_perfil(self, request: Request) -> Response:
        """Endpoint baseado na sua view editar_perfil"""
        try:
            cliente = Cliente.objects.get(user=request.user)
            
            # Atualizar dados do usuário
            user_data = request.data.get('user', {})
            if 'username' in user_data:
                cliente.user.username = user_data['username']
            if 'email' in user_data:
                cliente.user.email = user_data['email']
            if 'telefone' in user_data:
                cliente.user.telefone = user_data['telefone']
            if 'genero' in user_data:
                cliente.user.genero = user_data['genero']
            
            # Atualizar endereço
            endereco_data = request.data.get('endereco', {})
            if endereco_data:
                from ..models import Endereco
                endereco, created = Endereco.objects.update_or_create(
                    cep=endereco_data.get('cep'),
                    defaults={
                        'rua': endereco_data.get('rua', ''),
                        'numero': endereco_data.get('numero', ''),
                        'complemento': endereco_data.get('complemento', ''),
                        'cidade': endereco_data.get('cidade', ''),
                        'uf': endereco_data.get('estado', ''),
                        'bairro': endereco_data.get('bairro', '')
                    }
                )
                cliente.endereco = endereco
            
            cliente.user.save()
            cliente.save()
            
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data)
            
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente não encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
