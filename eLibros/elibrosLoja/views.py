from django.views.generic import TemplateView
from elibrosLoja.models import Livro, GeneroTextual, Categoria, Carrinho, ItemCarrinho
from django.shortcuts import render, get_object_or_404, redirect
import random
from django.contrib.auth.decorators import login_required
from elibrosLoja.forms import UserImageForm  
from elibrosLoja.models import UploadImage  

def Inicio(request):
    cliente = request.user
    livro = request.GET.get('livro')
    livros = Livro.objects.all()
    generos = GeneroTextual.objects.all()

    livros_filtrados = []
    
    if livro is not None:
        livros = livros.filter(titulo__contains=livro)

    generos = list(generos)
    random.shuffle(generos)
    for genero in generos:
        if livros.filter(genero=genero).exists():
            livros_filtrados.append({
                'genero': genero.nome,
                'livros': livros.filter(genero=genero),
            })

    context = {
        'livros': livros,
        'livros_indicacoes': livros.filter(categoria=Categoria.objects.get(nome='Indicações do eLibros')),
        'livros_filtrados_por_genero': livros_filtrados,
        'cliente': cliente,
    }

    return render(request, 'elibrosLoja/inicio.html', context=context, status=200)


class AboutPageView(TemplateView):
    template_name = "elibrosLoja/about.html"

def acervo(request):
    cliente = request.user
    livro = request.GET.get('livro')
    livros = Livro.objects.all()
    generos = GeneroTextual.objects.all()

    livros_filtrados = []
    
    if livro is not None:
        livros = livros.filter(titulo__contains=livro)

    generos = list(generos)
    random.shuffle(generos)
    for genero in generos:
        if livros.filter(genero=genero).exists():
            livros_filtrados.append({
                'genero': genero.nome,
                'livros': livros.filter(genero=genero)
            })

    context = {
        'livros': livros,
        'livros_indicacoes': livros.filter(categoria=Categoria.objects.get(nome='Indicações do eLibros')),
        'livros_filtrados_por_genero': livros_filtrados,
        'cliente': cliente,
    }
    return render(request, 'elibrosLoja/acervo.html', context=context, status=200)


def livro(request, titulo):
    cliente = request.user
    livros = Livro.objects.all()
    livro = livros.filter(titulo=titulo).first()
    preco_com_desconto = None

    if livro is not None:
        if livro.desconto:
            preco_com_desconto = livro.preco - (livro.preco * livro.desconto / 100)
    else:
        print('Livro não encontrado')

    context = {
        'livro': livro,
        'preco_com_desconto': preco_com_desconto,
        'cliente': cliente,}
    return render(request, 'elibrosLoja/livro.html', context=context)

@login_required
def carrinho(request):
    
    cliente = request.user
    carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)

    context = {
        'carrinho': carrinho,
        'cliente': cliente,
        }

    return render(request, 'elibrosLoja/carrinho.html', context=context)

@login_required
def comprar_agora(request, titulo):
    livro = get_object_or_404(Livro, titulo=titulo)
    cliente = request.user  # Assuming the user has a related Cliente object

    # Retrieve or create the cart for the logged-in user
    carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)

    # Check if the item is already in the cart
    item_carrinho, item_created = ItemCarrinho.objects.get_or_create(livro=livro, defaults={'quantidade': 1, 'preco': livro.preco})

    if not item_created:
        # If the item already exists, increase the quantity
        item_carrinho.quantidade += 1
        item_carrinho.save()

    # Add the item to the cart
    carrinho.items.add(item_carrinho)
    carrinho.update_total()
    carrinho.save()

    context = {
        'carrinho': carrinho,
        'cliente': cliente,
        }
    return render(request, 'elibrosLoja/carrinho.html', context=context)

def carrinho_vazio(request):
    return render(request, 'elibrosLoja/carrinho_vazio.html', context={})

@login_required
def perfil(request):
    cliente = request.user
    if request.method == 'POST':
        form = UserImageForm(request.POST, request.FILES, instance=cliente)
        if form.is_valid():
            form.save()
            return redirect('perfil')  # Redirect to the same page to see the changes
    else:
        form = UserImageForm(instance=cliente)
    
    context = {
        'cliente': cliente,
        'form': form,
    }
    return render(request, 'elibrosLoja/perfil.html', context=context)
    