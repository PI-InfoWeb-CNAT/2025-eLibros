from django.urls import path
import elibrosLoja.views.AdminViews as AdminViews



urlpatterns = [
    path("", AdminViews.admin, name="admin"),

    # listagem das instância de uma classe
    path("<str:classe>", AdminViews.listar_instancias, name="listar_instancias"),
    
    # detalhes de uma instância
    path("<str:classe>/<int:id>", AdminViews.detalhar_instancia, name="detalhar_instancia"),

    path("<str:classe>/editar/<int:id>", AdminViews.editar_instancia, name="editar_instancia"),
    path("<str:classe>/editar/", AdminViews.editar_instancia_postback, name="editar_instancia_postback"),

    path("<str:classe>/criar", AdminViews.criar_instancia, name="criar_instancia"),

    path("<str:classe>/excluir/<int:id>", AdminViews.excluir_instancia, name="excluir_instancia"),
    
    path("<str:classe>/excluir/", AdminViews.excluir_instancia_postback, name="excluir_instancia_postback"),
]