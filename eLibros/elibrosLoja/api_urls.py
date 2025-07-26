from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from . import api_views

# Registrar ViewSets no router
router = DefaultRouter()
router.register(r'livros', api_views.LivroViewSet)
router.register(r'autores', api_views.AutorViewSet)
router.register(r'categorias', api_views.CategoriaViewSet)
router.register(r'generos', api_views.GeneroViewSet)
router.register(r'carrinho', api_views.CarrinhoViewSet, basename='carrinho')
router.register(r'pedidos', api_views.PedidoViewSet, basename='pedido')
router.register(r'cliente', api_views.ClienteViewSet, basename='cliente')

urlpatterns = [
    # JWT Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # ViewSets URLs
    path('', include(router.urls)),
    
    # Custom endpoints baseados nas suas views existentes
    path('inicio/', api_views.inicio, name='api_inicio'),
    path('livros/destaque/', api_views.livros_destaque, name='livros_destaque'),
    path('livros/lancamentos/', api_views.livros_lancamentos, name='livros_lancamentos'),
    path('estatisticas/', api_views.estatisticas, name='estatisticas'),
    
    # === ENDPOINTS DE AVALIAÇÕES ===
    path('livros/<int:livro_id>/avaliacoes/', api_views.avaliacoes_livro, name='avaliacoes_livro'),
    path('avaliacoes/<int:avaliacao_id>/curtir/', api_views.curtir_avaliacao, name='curtir_avaliacao'),
    
    # Endpoints específicos dos ViewSets que simulam suas URLs existentes
    # /api/v1/livros/explorar/?pesquisa=termo&genero=fiction&autor=nome
    # /api/v1/livros/acervo/
    # /api/v1/carrinho/atualizar_carrinho/
    # /api/v1/carrinho/aplicar_cupom/
    # /api/v1/pedidos/meus_pedidos/
]
