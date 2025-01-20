from django.urls import path
import elibrosLoja.views.LivroViews as LivroViews

urlpatterns = [
    path("", LivroViews.acervo, name="acervo"),
    path("livro/<int:id>", LivroViews.livro, name="livro"),
]