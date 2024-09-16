from django.urls import path

from .views import AboutPageView, acervo, Inicio, livro, comprar_agora, perfil, ver_carrinho

urlpatterns = [
    path("", Inicio, name="inicio"),
    path("about/", AboutPageView.as_view(), name="about"),
    path("acervo/", acervo, name="acervo"),
    path("acervo/livro/<str:titulo>", livro, name="livro"),
    path("carrinho/", ver_carrinho, name="carrinho"),
    
    path("carrinho/<str:titulo>", comprar_agora, name="comprar_agora"),
    path("perfil/", perfil, name="perfil"),
]
