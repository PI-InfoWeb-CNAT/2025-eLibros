from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from elibrosLoja.models import Livro, Pedido, GeneroLiterario, Categoria
from accounts.models import Cliente
permissoes_admin_elibros = {
    'livros': ['c', 'r', 'u', 'd'],
    'pedidos': ['r', 'u', 'd'],
    'clientes': ['r', 'u', 'd'],
    'generos': ['c', 'r', 'd'],
    'categorias': ['c', 'r', 'd'],
    'enderecos': ['c', 'r', 'u', 'd'],
}


@login_required
def admin(request):
    return render(request, 'elibrosLoja/admin/home.html')

@login_required
def listar_instancias(request, classe):

    botao = False

    if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:
        instancias = eval(classe.capitalize()).objects.all()
    else:
        instancias = []

    if classe != 'pedidos' and classe != 'clientes':
        botao = True

    return render(request, 'elibrosLoja/admin/manter.html',
                  {'instancias': instancias,
                   'classe': classe,
                   'permissoes': permissoes_admin_elibros[classe],
                   'botao': botao})

@login_required
def detalhar_instancia(request, classe, id):
    if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:
        instancia = eval(classe.capitalize()).objects.get(id=id)
    else:
        instancia = None
    return render(request, 'elibrosLoja/admin/detalhar_instancia.html', {'instancia': instancia})

@login_required
def editar_instancia(request, classe, id):
    if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:
        instancia = eval(classe.capitalize()).objects.get(id=id)
    else:
        instancia = None
    return render(request, 'elibrosLoja/admin/editar_instancia.html', {'instancia': instancia})
