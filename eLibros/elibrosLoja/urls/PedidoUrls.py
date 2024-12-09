from django.urls import path
from elibrosLoja.views import finalizar_compra, finalizar_compra_postback, aplicar_cupom, remover_cupom

urlpatterns = [

    path("aplicar_cupom/", aplicar_cupom, name="aplicar_cupom"),
    path("remover_cupom/", remover_cupom, name="remover_cupom"),
    path("finalizar_compra/", finalizar_compra, name="finalizar_compra"),
    path("finalizar_compra_postback/", finalizar_compra_postback, name="finalizar_compra_postback"),
    
]