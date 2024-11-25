from django.urls import path
from elibrosLoja.views import atualizar_carrinho, ver_carrinho

urlpatterns = [
    path("", ver_carrinho, name="carrinho"), 
    path("atualizar_carrinho", atualizar_carrinho, name="atualizar_carrinho"),
    
    ]