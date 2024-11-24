from django.urls import path
from elibrosLoja.views import finalizar_compra

urlpatterns = [
    path("finalizar_compra", finalizar_compra, name="finalizar_compra"),
]