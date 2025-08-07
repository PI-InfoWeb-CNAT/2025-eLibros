from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.shortcuts import redirect

def api_root(request):
    """Página raiz redirecionando para a documentação da API"""
    return HttpResponse("""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>eLibros API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            h1 { color: #C5A572; }
            h2 { color: #1C1607; border-bottom: 2px solid #FFD147; padding-bottom: 5px; }
            .endpoints { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .endpoint-group { background: #f9f9f9; padding: 15px; border-radius: 8px; }
            .endpoint-group h3 { margin-top: 0; color: #C5A572; }
            ul { list-style-type: none; padding: 0; }
            li { margin: 5px 0; }
            a { color: #1C1607; text-decoration: none; }
            a:hover { color: #C5A572; text-decoration: underline; }
            .frontend-link { background: #FFD147; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .status { background: #e8f5e8; padding: 10px; border-radius: 5px; border-left: 4px solid #4caf50; }
        </style>
    </head>
    <body>
        <h1>eLibros API - Sistema de Livraria Online</h1>
        
        <div class="status">
            <strong>Status:</strong> API REST ativa e funcionando ✅<br>
            <strong>Versão:</strong> v1.0<br>
            <strong>Django Admin:</strong> Configurado e ativo
        </div>
        
        <div class="frontend-link">
            <strong>Frontend Next.js:</strong> 
            <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
        </div>
        
        <h2>Endpoints da API</h2>
        <div class="endpoints">
            <div class="endpoint-group">
                <h3>📚 Catálogo</h3>
                <ul>
                    <li><a href="/api/v1/livros/">📖 Livros</a></li>
                    <li><a href="/api/v1/autores/">👨‍💼 Autores</a></li>
                    <li><a href="/api/v1/categorias/">📂 Categorias</a></li>
                    <li><a href="/api/v1/generos/">🎭 Gêneros</a></li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>👥 Usuários</h3>
                <ul>
                    <li><a href="/api/v1/usuarios/">👤 Usuários</a></li>
                    <li><a href="/api/v1/cliente/">🛍️ Clientes</a></li>
                    <li><a href="/api/v1/auth/login/">🔐 Login JWT</a></li>
                    <li><a href="/api/v1/auth/refresh/">🔄 Refresh Token</a></li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>🛒 Compras</h3>
                <ul>
                    <li><a href="/api/v1/carrinhos/">🛒 Carrinhos</a></li>
                    <li><a href="/api/v1/pedidos/">📦 Pedidos</a></li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>⭐ Avaliações</h3>
                <ul>
                    <li><a href="/api/v1/avaliacoes/">⭐ Avaliações</a></li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>📊 Utilidades</h3>
                <ul>
                    <li><a href="/api/v1/inicio/">🏠 Página Inicial</a></li>
                    <li><a href="/api/v1/estatisticas/">📊 Estatísticas</a></li>
                    <li><a href="/api/v1/">🔍 API Root</a></li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>⚙️ Administração</h3>
                <ul>
                    <li><a href="/djangoadmin/">🔧 Django Admin</a></li>
                </ul>
            </div>
        </div>
        
        <h2>Modelos Disponíveis no Admin</h2>
        <p>Acesse o <a href="/djangoadmin/">Django Admin</a> para gerenciar:</p>
        <div class="endpoints">
            <div class="endpoint-group">
                <h3>📋 Principais</h3>
                <ul>
                    <li>📖 Livros</li>
                    <li>👨‍💼 Autores</li>
                    <li>📂 Categorias</li>
                    <li>🎭 Gêneros</li>
                    <li>👤 Usuários/Clientes</li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>🛒 Comércio</h3>
                <ul>
                    <li>🛒 Carrinhos</li>
                    <li>📦 Pedidos</li>
                    <li>🏷️ Cupons</li>
                    <li>📍 Endereços</li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>📝 Interação</h3>
                <ul>
                    <li>⭐ Avaliações</li>
                    <li>👍 Curtidas</li>
                    <li>🗂️ Itens do Carrinho</li>
                </ul>
            </div>
            
            <div class="endpoint-group">
                <h3>👨‍💼 Sistema</h3>
                <ul>
                    <li>🔧 Administradores</li>
                    <li>📊 Histórico (Simple History)</li>
                </ul>
            </div>
        </div>
        
        <hr style="margin: 40px 0;">
        <p style="text-align: center; color: #666;">
            eLibros - Sistema desenvolvido com Django REST Framework + Next.js
        </p>
    </body>
    </html>
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