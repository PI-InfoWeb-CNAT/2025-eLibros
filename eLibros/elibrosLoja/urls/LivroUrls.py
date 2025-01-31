from django.urls import path
from elibrosLoja.views import LivroViews

urlpatterns = [
    path("", LivroViews.acervo, name="acervo"),
    path("livro/<int:id>", LivroViews.livro, name="livro"),
    path("explorar/", LivroViews.explorar, name="explorar"),
    path("explorar/<str:busca>", LivroViews.explorar, name="explorar"),
]