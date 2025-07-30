from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.shortcuts import redirect

def api_root(request):
    """Página raiz redirecionando para a documentação da API"""
    return HttpResponse("""
    <h1>eLibros API</h1>
    <p>Esta é uma API REST para o eLibros.</p>
    <p>Acesse os endpoints disponíveis:</p>
    <ul>
        <li><a href="/api/v1/">API v1</a></li>
        <li><a href="/api/v1/livros/">Livros</a></li>
        <li><a href="/api/v1/autores/">Autores</a></li>
        <li><a href="/api/v1/categorias/">Categorias</a></li>
        <li><a href="/api/v1/generos/">Gêneros</a></li>
        <li><a href="/djangoadmin/">Admin Django</a></li>
    </ul>
    <p>Frontend disponível em: <a href="http://localhost:3001">http://localhost:3001</a></p>
    """)

urlpatterns = [
    # Admin Django
    path("djangoadmin/", admin.site.urls),
    
    # API URLs - apenas essas devem ser mantidas
    path("api/v1/", include("elibrosLoja.api_urls")),
    
    # Página raiz mostrando informações da API
    path("", api_root),
    
    # Redirecionar qualquer outra rota para a API ou frontend
    path("accounts/", lambda request: redirect("/api/v1/")),
    path("acervo/", lambda request: redirect("/api/v1/livros/")),
    path("cliente/", lambda request: redirect("/api/v1/")),
    path("carrinho/", lambda request: redirect("/api/v1/")),
    path("admin/", lambda request: redirect("/djangoadmin/")),
    path("pedido/", lambda request: redirect("/api/v1/")),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)