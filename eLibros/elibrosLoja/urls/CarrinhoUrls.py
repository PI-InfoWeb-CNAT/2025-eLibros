from django.urls import path
from elibrosLoja.views import CarrinhoViews

urlpatterns = [
    path("", CarrinhoViews.ver_carrinho, name="carrinho"), 
    path("atualizar_carrinho", CarrinhoViews.atualizar_carrinho, name="atualizar_carrinho"),
    path("aplicar_cupom/", CarrinhoViews.aplicar_cupom, name="aplicar_cupom"),
    path("remover_cupom/", CarrinhoViews.remover_cupom, name="remover_cupom"),
    path("finalizar_compra/", CarrinhoViews.finalizar_compra, name="finalizar_compra"),
    path("finalizar_compra_postback/", CarrinhoViews.finalizar_compra_postback, name="finalizar_compra_postback"),
    
    ]