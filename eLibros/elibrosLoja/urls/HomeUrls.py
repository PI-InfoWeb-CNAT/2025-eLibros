from django.urls import path
from elibrosLoja.views import Inicio

urlpatterns = [
    path("", Inicio, name="inicio"),

]