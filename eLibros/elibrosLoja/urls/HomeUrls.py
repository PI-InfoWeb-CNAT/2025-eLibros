from django.urls import path
import elibrosLoja.views.LivroViews as LivroViews

urlpatterns = [
    path("", LivroViews.Inicio, name="inicio"),

]