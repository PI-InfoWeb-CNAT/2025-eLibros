from django.urls import path
from elibrosLoja.views import ClienteViews

urlpatterns = [
    path("", ClienteViews.perfil, name="perfil"),
    path("editar/", ClienteViews.editar_perfil, name="editar_perfil"),
    path("adicionar_endereco/", ClienteViews.adicionar_endereco, name="adicionar_endereco"),
    path("editar_endereco/<int:id_endereco>/", ClienteViews.editar_endereco, name="editar_endereco"),
    path("excluir_endereco/<int:id_endereco>/", ClienteViews.excluir_endereco, name="excluir_endereco"),
]