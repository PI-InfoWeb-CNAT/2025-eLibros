from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# permissoes_admin_elibros = {
#     'livros': ['c', 'r', 'u', 'd'],
#     'pedidos': ['r', 'u', 'd'],
#     'clientes': ['r', 'u', 'd'],
#     'generos': ['c', 'r', 'd'],
#     'categorias': ['c', 'r', 'd']
#     'enderecos': ['c', 'r', 'u', 'd'],
# }

@login_required
def admin(request):
    return render(request, 'elibrosLoja/admin/home.html')
