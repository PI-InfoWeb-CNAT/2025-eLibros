from django.urls import path, include
from django.urls.resolvers import URLPattern, URLResolver
from typing import List, Union
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView

# Importar views JWT customizadas
from accounts.jwt_views import CustomTokenObtainPairView, CustomTokenRefreshView

from . import views
from .views import (
    LivroViewSet, AutorViewSet, CategoriaViewSet, GeneroViewSet,
    ClienteViewSet, CarrinhoViewSet, AvaliacaoViewSet, PedidoViewSet,
    UsuarioViewSet
)

# Registrar ViewSets no router
router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'generos', GeneroViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'cliente', ClienteViewSet, basename='cliente')
router.register(r'carrinhos', CarrinhoViewSet, basename='carrinho')
router.register(r'avaliacoes', AvaliacaoViewSet, basename='avaliacao')
router.register(r'pedidos', PedidoViewSet, basename='pedido')

# Tipo: Lista, que pode conter URLPattern (um url individual) e URLResolver (aponta para outro conjunto de URLs)
urlpatterns: List[Union[URLPattern, URLResolver]] = [
    # Autenticação JWT customizada - PRIORITÁRIA
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('auth/refresh/', CustomTokenRefreshView.as_view(), name='custom_token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # ViewSets URLs - inclui endpoints customizados do UsuarioViewSet
    # POST /api/usuarios/ - Criar conta
    # POST /api/usuarios/login/ - Login alternativo (usar JWT acima preferencialmente)
    # POST /api/usuarios/logout/ - Logout
    # POST /api/usuarios/reset_password/ - Solicitar reset de senha
    # POST /api/usuarios/password_reset_confirmation/ - Confirmar reset de senha
    path('', include(router.urls)),
    
    # Custom endpoints que não estão nos ViewSets
    path('inicio/', views.inicio, name='api_inicio'),
    path('estatisticas/', views.estatisticas, name='estatisticas'),
]
