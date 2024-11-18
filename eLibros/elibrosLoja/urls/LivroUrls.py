from django.urls import path
from elibrosLoja.views import acervo, livro

urlpatterns = [
    path("", acervo, name="acervo"),
    path("/livro/<int:id>", livro, name="livro"),
]