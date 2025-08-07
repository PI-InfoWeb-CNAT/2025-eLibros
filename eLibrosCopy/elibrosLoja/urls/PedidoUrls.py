from django.urls import path
from elibrosLoja.views import PedidoViews

urlpatterns = [
    path('pedidos/', PedidoViews.pedidos, name='pedidos'),
    path('cancelar-pedido/<str:numero_pedido>/', PedidoViews.cancelar_pedido, name='cancelar_pedido'),
    path('confirmar-recebimento/<str:numero_pedido>/', PedidoViews.confirmar_recebimento, name='confirmar_recebimento'),
    path('ver-pedido/<str:numero_pedido>/', PedidoViews.ver_pedido, name='ver_pedido'),
]