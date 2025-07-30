from django.urls import path, include
from django.urls.resolvers import URLPattern, URLResolver
from typing import List, Union
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from . import views
from .views import (
    LivroViewSet, AutorViewSet, CategoriaViewSet, GeneroViewSet,
    ClienteViewSet, CarrinhoViewSet, AvaliacaoViewSet, PedidoViewSet
)

# Registrar ViewSets no router
router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'generos', GeneroViewSet)
router.register(r'cliente', ClienteViewSet, basename='cliente')
router.register(r'carrinhos', CarrinhoViewSet, basename='carrinho')
router.register(r'avaliacoes', AvaliacaoViewSet, basename='avaliacao')
router.register(r'pedidos', PedidoViewSet, basename='pedido')

# Tipo: Lista, que pode conter URLPattern (um url individual) e URLResolver (aponta para outro conjunto de URLs)
urlpatterns: List[Union[URLPattern, URLResolver]] = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # ViewSets URLs, do tipo URLResolver
    path('', include(router.urls)),
    
    # Custom endpoints que não estão nos ViewSets
    path('inicio/', views.inicio, name='api_inicio'),
    # As rotas abaixo agora são servidas pelos ViewSets e seus métodos action:
    # - /api/livros/destaque/ → LivroViewSet.destaque
    # - /api/livros/lancamentos/ → LivroViewSet.lancamentos
    # - /api/avaliacoes/livro/{livro_id}/ → AvaliacaoViewSet.avaliacoes_livro
    # - /api/avaliacoes/{avaliacao_id}/curtir/ → AvaliacaoViewSet.curtir_avaliacao
    path('estatisticas/', views.estatisticas, name='estatisticas'),
    
    # Endpoints específicos dos ViewSets que simulam suas URLs existentes
    # /api/livros/explorar/?pesquisa=termo&genero=fiction&autor=nome
    # /api/livros/acervo/
    # /api/livros/destaque/
    # /api/livros/lancamentos/
    # /api/carrinhos/atualizar_carrinho/
    # /api/carrinhos/aplicar_cupom/
    # /api/pedidos/meus_pedidos/
    # /api/avaliacoes/livro/{livro_id}/
    # /api/avaliacoes/{avaliacao_id}/curtir/
]
