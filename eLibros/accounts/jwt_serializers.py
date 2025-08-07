"""
Serializers customizados para JWT baseados no modelo Usuario customizado
"""
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import Usuario


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer customizado para obter tokens JWT usando email em vez de username
    """
    username_field = Usuario.USERNAME_FIELD

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField()
        self.fields['password'] = serializers.CharField()

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Adicionar claims customizados ao token
        token['email'] = user.email
        token['nome'] = user.nome
        token['is_verified'] = user.email_is_verified
        
        return token

    def validate(self, attrs):
        # Usar email para autenticação em vez de username
        email = attrs.get(self.username_field)
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,  # Django auth backend usa 'username' internamente
                password=password
            )
            
            if not user:
                raise serializers.ValidationError(
                    'Credenciais inválidas.',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'Conta desativada.',
                    code='authorization'
                )

            # Verificar se o email foi verificado (opcional)
            # if not user.email_is_verified:
            #     raise serializers.ValidationError(
            #         'Email não verificado. Verifique seu email antes de fazer login.',
            #         code='authorization'
            #     )

            refresh = self.get_token(user)

            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            return data
        else:
            raise serializers.ValidationError(
                'Email e senha são obrigatórios.',
                code='authorization'
            )


class CustomTokenRefreshSerializer(serializers.Serializer):
    """
    Serializer para refresh de tokens JWT
    """
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh_token = RefreshToken(attrs['refresh'])
        # Gerar novo access token
        access_token = refresh_token.access_token
        data = {'access': str(access_token)}

        return data
