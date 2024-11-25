from django.urls import path
from elibrosLoja.views import finalizar_compra, aplicar_cupom

urlpatterns = [
    path("aplicar_cupom", aplicar_cupom, name="aplicar_cupom"),
    path("finalizar_compra", finalizar_compra, name="finalizar_compra"),
    
]