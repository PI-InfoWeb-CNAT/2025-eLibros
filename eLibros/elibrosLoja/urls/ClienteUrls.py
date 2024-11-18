from django.urls import path
from elibrosLoja.views import perfil

urlpatterns = [
    path("", perfil, name="perfil"),
    
]