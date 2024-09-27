from django.urls import path

from .views import AboutPageView, acervo, Inicio, livro, comprar_agora, perfil, ver_carrinho, admin, remover_itemcarrinho, adicionar_itemcarrinho, atualizar_quantidade

urlpatterns = [
    path("", Inicio, name="inicio"),
    path("about/", AboutPageView.as_view(), name="about"),
    path("acervo/", acervo, name="acervo"),
    path("acervo/livro/<int:id>", livro, name="livro"),
    path("carrinho/", ver_carrinho, name="carrinho"),
    path("carrinho/<int:id>", comprar_agora, name="comprar_agora"),
    path("carrinho/adicionar/<int:id>", adicionar_itemcarrinho, name="adicionar_itemcarrinho"),
    path("carrinho/atualizar/<int:id>", atualizar_quantidade, name="atualizar_quantidade"),
    path("carrinho/remover/<int:id>", remover_itemcarrinho, name="remover_itemcarrinho"),
    path("perfil/", perfil, name="perfil"),
    path("admin/", admin, name="admin"),
]
