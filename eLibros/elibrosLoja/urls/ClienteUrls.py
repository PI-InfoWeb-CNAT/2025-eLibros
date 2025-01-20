from django.urls import path
import elibrosLoja.views.ClienteViews as ClienteViews

urlpatterns = [
    path("", ClienteViews.perfil, name="perfil"),
    path("adicionar_endereco/", ClienteViews.adicionar_endereco, name="adicionar_endereco"),
    path("pedidos/", ClienteViews.pedidos, name="pedidos"),
    path('cancelar-pedido/<str:numero_pedido>/', ClienteViews.cancelar_pedido, name='cancelar_pedido'),
    path('confirmar-recebimento/<str:numero_pedido>/', ClienteViews.confirmar_recebimento, name='confirmar_recebimento'),
]