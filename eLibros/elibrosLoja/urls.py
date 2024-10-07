from django.urls import path
from .views import *

urlpatterns = [
    path("", Inicio, name="inicio"),
    path("about/", AboutPageView.as_view(), name="about"),
    path("acervo/", acervo, name="acervo"),
    path("acervo/livro/<int:id>", livro, name="livro"),

    path("atualizar_carrinho", atualizar_carrinho, name="atualizar_carrinho"),
    path("carrinho/", ver_carrinho, name="carrinho"),
    
    path("perfil/", perfil, name="perfil"),
    path("admin/", admin, name="admin"),
]
