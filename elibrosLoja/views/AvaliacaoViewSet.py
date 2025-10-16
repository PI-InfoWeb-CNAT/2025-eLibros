from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from typing import Any
from ..serializers import (
    AvaliacaoSerializer,
    AvaliacaoCreateSerializer
    )

from ..models import (
    Livro, Avaliacao, CurtidaAvaliacao
)

class AvaliacaoViewSet(viewsets.ModelViewSet[Avaliacao]):
    """ViewSet para gerenciar avaliações"""
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['livro__titulo', 'usuario__username']
    ordering = ['-data_publicacao']
    
    def get_permissions(self) -> list[Any]:
        """
        Define as permissões baseadas na action:
        - list e retrieve: qualquer um pode acessar
        - outras ações: apenas usuários autenticados
        """
        if self.action == 'avaliacoes_livro' and self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['GET', 'POST'], url_path='livro/(?P<livro_id>[^/.]+)')
    def avaliacoes_livro(self, request: Request, livro_id: int) -> Response:
        """
        GET: Lista avaliações de um livro\n
        POST: Cria nova avaliação (requer autenticação)
        """
        livro = get_object_or_404(Livro, id=livro_id)
        
        # Caso GET para listar avaliações
        if request.method == 'GET':
            avaliacoes = Avaliacao.objects.filter(livro=livro).select_related('usuario')
            serializer = AvaliacaoSerializer(avaliacoes, many=True, context={'request': request})
            return Response(serializer.data)
        
        # Caso POST para criar avaliação
        elif request.method == 'POST':
            if not request.user.is_authenticated:
                return Response(
                    {'detail': 'Autenticação necessária para avaliar'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verificar se usuário já avaliou este livro
            if Avaliacao.objects.filter(usuario=request.user, livro=livro).exists():
                return Response(
                    {'detail': 'Você já avaliou este livro'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = AvaliacaoCreateSerializer(
                data=request.data, 
                context={'request': request}
            )
            if serializer.is_valid():
                avaliacao = serializer.save(usuario=request.user, livro=livro)
                response_serializer = AvaliacaoSerializer(avaliacao, context={'request': request})
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'detail': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


    @action(detail=True, methods=['POST', 'DELETE'], url_path='curtir', permission_classes=[IsAuthenticated])
    def curtir_avaliacao(self, request: Request, pk: Any = None) -> Response:
        """
        POST: Curtir uma avaliação \n
        DELETE: Remover curtida
        """
        avaliacao = self.get_object()
        
        # Usuário não pode curtir própria avaliação
        if avaliacao.usuario == request.user:
            return Response(
                {'detail': 'Você não pode curtir sua própria avaliação'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        curtida = CurtidaAvaliacao.objects.filter(
            usuario=request.user, 
            avaliacao=avaliacao
        ).first()

        if request.method == 'POST':
            if curtida:
                return Response(
                    {'detail': 'Você já curtiu esta avaliação'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            CurtidaAvaliacao.objects.create(usuario=request.user, avaliacao=avaliacao)
            
            # Atualizar contador de curtidas
            if hasattr(avaliacao, 'curtidas_usuarios'):
                avaliacao.curtidas = avaliacao.curtidas_usuarios.count()

            avaliacao.save(update_fields=['curtidas'])
            
            return Response({'detail': 'Avaliação curtida com sucesso'})
        
        elif request.method == 'DELETE':
            if not curtida:
                return Response(
                    {'detail': 'Você não curtiu esta avaliação'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            curtida.delete()

            if hasattr(avaliacao, 'curtidas_usuarios'):
                avaliacao.curtidas = avaliacao.curtidas_usuarios.count()
            avaliacao.save(update_fields=['curtidas'])
            
            return Response({'detail': 'Curtida removida com sucesso'})
        
        return Response({'detail': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
