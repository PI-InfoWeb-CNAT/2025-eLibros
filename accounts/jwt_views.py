"""
Views customizadas para autenticação JWT
"""
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .jwt_serializers import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer
from elibrosLoja.serializers import UsuarioSerializer

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    View customizada para obter tokens JWT com informações do usuário
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({
                'error': 'Credenciais inválidas',
                'detail': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Obter o usuário para incluir seus dados na resposta
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        response_data = serializer.validated_data.copy()
        if user:
            response_data['user'] = UsuarioSerializer(user).data

        return Response(response_data, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    """
    View customizada para refresh de tokens JWT
    """
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({
                'error': 'Token inválido',
                'detail': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
