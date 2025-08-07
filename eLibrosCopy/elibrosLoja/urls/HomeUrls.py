from django.urls import path
from elibrosLoja.views import LivroViews

urlpatterns = [
    path("", LivroViews.Inicio, name="inicio"),

]