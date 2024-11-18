from django.urls import path
from elibrosLoja.views import admin, listar_instancias, detalhar_instancia, editar_instancia, editar_instancia_postback, criar_instancia, excluir_instancia, excluir_instancia_postback

urlpatterns = [
    path("", admin, name="admin"),

    # listagem das instância de uma classe
    path("/<str:classe>", listar_instancias, name="listar_instancias"),
    
    # detalhes de uma instância
    path("/<str:classe>/<int:id>", detalhar_instancia, name="detalhar_instancia"),

    path("/<str:classe>/editar/<int:id>", editar_instancia, name="editar_instancia"),
    path("/<str:classe>/editar/", editar_instancia_postback, name="editar_instancia_postback"),

    path("/<str:classe>/criar", criar_instancia, name="criar_instancia"),

    path("/<str:classe>/excluir/<int:id>", excluir_instancia, name="excluir_instancia"),
    path("/<str:classe>/excluir/", excluir_instancia_postback, name="excluir_instancia_postback"),
]