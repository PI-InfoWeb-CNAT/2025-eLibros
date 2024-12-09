from django.urls import path
from elibrosLoja.views import perfil, adicionar_endereco, pedidos, cancelar_pedido, confirmar_recebimento

urlpatterns = [
    path("", perfil, name="perfil"),
    path("adicionar_endereco/", adicionar_endereco, name="adicionar_endereco"),
    path("pedidos/", pedidos, name="pedidos"),
    path('cancelar-pedido/<str:numero_pedido>/', cancelar_pedido, name='cancelar_pedido'),
    path('confirmar-recebimento/<str:numero_pedido>/', confirmar_recebimento, name='confirmar_recebimento'),
]