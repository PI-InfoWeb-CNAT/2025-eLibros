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
    UsuarioLoginSerializer,
    UsuarioLogoutSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
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
        elif self.action == 'login':
            return UsuarioLoginSerializer
        elif self.action == 'logout':
            return UsuarioLogoutSerializer
        elif self.action == 'reset_password':
            return PasswordResetSerializer
        elif self.action == 'password_reset_confirmation':
            return PasswordResetConfirmSerializer
        return UsuarioSerializer
    
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
    
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def logout(self, request: Request) -> Response:
        """Endpoint para logout do usuário"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Logout realizado com sucesso.'
        }, status=status.HTTP_200_OK)

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