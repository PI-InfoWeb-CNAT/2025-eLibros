from typing import Any
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
import os

from accounts.models import Usuario
from ..serializers import (
    UsuarioSerializer,
    UsuarioCreateSerializer,
    UsuarioUpdateSerializer,
    UsuarioLoginSerializer,
    UsuarioLogoutSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse


@extend_schema_view(
    list=extend_schema(
        tags=['Usuários'],
        summary='Listar usuários',
        description='Lista todos os usuários cadastrados (requer autenticação de admin)'
    ),
    retrieve=extend_schema(
        tags=['Usuários'],
        summary='Detalhes do usuário',
        description='Retorna detalhes de um usuário específico (requer autenticação)'
    ),
    create=extend_schema(
        tags=['Usuários'],
        summary='Criar conta',
        description='Cria uma nova conta de usuário (público)'
    ),
    update=extend_schema(
        tags=['Usuários'],
        summary='Atualizar usuário',
        description='Atualiza todos os dados de um usuário (requer autenticação)'
    ),
    partial_update=extend_schema(
        tags=['Usuários'],
        summary='Atualizar parcialmente usuário',
        description='Atualiza alguns campos de um usuário (requer autenticação)'
    ),
    destroy=extend_schema(
        tags=['Usuários'],
        summary='Deletar usuário',
        description='Remove um usuário (requer autenticação)'
    ),
)
class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações relacionadas ao usuário.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'login', 'reset_password', 'password_reset_confirmation']:
            return [permissions.AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_serializer_class(self) -> Any:
        if self.action == 'create':
            return UsuarioCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UsuarioUpdateSerializer
        elif self.action == 'login':
            return UsuarioLoginSerializer
        elif self.action == 'logout':
            return UsuarioLogoutSerializer
        elif self.action == 'reset_password':
            return PasswordResetSerializer
        elif self.action == 'password_reset_confirmation':
            return PasswordResetConfirmSerializer
        return UsuarioSerializer
    
    @extend_schema(
        tags=['Autenticação'],
        summary='Login de usuário',
        description='Autentica um usuário e retorna tokens JWT de acesso e refresh'
    )
    @action(detail=False, methods=['POST'], permission_classes=[AllowAny])
    def login(self, request: Request) -> Response:
        """Endpoint para login do usuário"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UsuarioSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        tags=['Autenticação'],
        summary='Logout de usuário',
        description='Invalida o refresh token do usuário (blacklist)'
    )
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def logout(self, request: Request) -> Response:
        """Endpoint para logout do usuário"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Logout realizado com sucesso.'
        }, status=status.HTTP_200_OK)

    @extend_schema(
        tags=['Autenticação'],
        summary='Solicitar reset de senha',
        description='Envia email com código OTP para redefinição de senha'
    )
    @action(detail=False, methods=['POST'], permission_classes=[AllowAny])
    def reset_password(self, request: Request) -> Response:
        """Endpoint para redefinição de senha do usuário"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        data = serializer.save()

        # Construir URL dinamicamente baseado no ambiente
        if 'CODESPACE_NAME' in os.environ:
            codespace_name = os.getenv("CODESPACE_NAME")
            codespace_domain = os.getenv("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
            base_url = f"https://{codespace_name}-3000.{codespace_domain}"
        else:
            base_url = "http://localhost:3000"
        
        confirmation_url = f"{base_url}/reset-password?token={data['otp']}&email={email}"

        subject = "Redefinição de Senha - eLibros"
        message = f"""
        Use esse código para resetar sua senha: {data['otp']}
        
        Ou clique no link abaixo para redefinir sua senha:
        {confirmation_url}
        
        Se você não solicitou essa redefinição, ignore este email.
        
        Este código expira em 1 hora.
        """

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return Response({
            'message': 'Instruções para redefinição de senha enviadas por email.',
            'email': email
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        tags=['Autenticação'],
        summary='Confirmar reset de senha',
        description='Confirma o código OTP e redefine a senha do usuário'
    )
    @action(detail=False, methods=['POST'], permission_classes=[AllowAny])
    def password_reset_confirmation(self, request: Request) -> Response:
        """
        Endpoint para confirmar a redefinição de senha.
        Recebe: email, otp, new_password, confirm_password
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Gerar tokens JWT para login automático após reset
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Senha redefinida com sucesso.',
            'user': UsuarioSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        tags=['Usuários'],
        summary='Upload de foto de perfil',
        description='Faz upload da foto de perfil do usuário para o ImageKit.io',
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'foto_de_perfil': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Arquivo de imagem da foto de perfil'
                    }
                }
            }
        },
        responses={
            200: OpenApiResponse(description='Foto atualizada com sucesso'),
            400: OpenApiResponse(description='Nenhuma foto foi enviada'),
            500: OpenApiResponse(description='Erro ao fazer upload')
        }
    )
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def upload_foto_perfil(self, request: Request) -> Response:
        """
        Endpoint para upload de foto de perfil via ImageKit.
        Recebe: foto_de_perfil (arquivo de imagem)
        """
        from utils.imagekit_config import upload_image_to_imagekit, delete_image_from_imagekit
        
        user = request.user
        foto = request.FILES.get('foto_de_perfil')
        
        if not foto:
            return Response({
                'error': 'Nenhuma foto foi enviada.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Deletar foto antiga se existir
        if user.foto_de_perfil_file_id:
            delete_image_from_imagekit(user.foto_de_perfil_file_id)
        
        # Upload da nova foto
        upload_result = upload_image_to_imagekit(
            file=foto,
            file_name=foto.name,
            folder='perfis',
            tags=['perfil', f'user_{user.id}']
        )
        
        if not upload_result:
            return Response({
                'error': 'Erro ao fazer upload da foto.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Atualizar usuário
        user.foto_de_perfil_url = upload_result['url']
        user.foto_de_perfil_file_id = upload_result['file_id']
        user.save()
        
        return Response({
            'message': 'Foto de perfil atualizada com sucesso.',
            'foto_url': upload_result['url']
        }, status=status.HTTP_200_OK)