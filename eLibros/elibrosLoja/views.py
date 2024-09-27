from django.views.generic import TemplateView
from elibrosLoja.models import Livro, GeneroTextual, Categoria, Carrinho, ItemCarrinho
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_POST
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


def livro(request, id):
    cliente = request.user
    livro = get_object_or_404(Livro, id=id)
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


def ver_carrinho(request): #show cart    
    cliente = request.user # okay
    
    carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
    print(cliente)
    print(carrinho)

    context = {
        'carrinho': carrinho,
        'cliente': cliente,
        }

    return render(request, 'elibrosLoja/carrinho.html', context=context)


def adicionar_itemcarrinho(request, id, quantidade):
    livro = get_object_or_404(Livro, id=id)
    cliente = request.user
    carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
    quantidade = int(request.GET.get('quantity', 1))

    item_carrinho, item_created = ItemCarrinho.objects.get_or_create(livro=livro, defaults={'quantidade': quantidade, 'preco': livro.preco})

    if not item_created:
        item_carrinho.quantidade += quantidade
        item_carrinho.save()

    carrinho.items.add(item_carrinho)
    carrinho.update_total()
    carrinho.save()

    return redirect('carrinho')

def remover_itemcarrinho(request, id):
    cliente = request.user
    carrinho = Carrinho.objects.get(cliente=cliente)

    try:
        item_carrinho = ItemCarrinho.objects.get(id=id)
        if item_carrinho in carrinho.items.all():
            carrinho.items.remove(item_carrinho) 

            item_carrinho.delete() 

            carrinho.update_total()
            carrinho.save()
    except ItemCarrinho.DoesNotExist:
      
        print('Item não encontrado')

    return redirect('carrinho')

@require_POST
def atualizar_quantidade(request, id):
    cliente = request.user
    carrinho = Carrinho.objects.get(cliente=cliente)
    quantidade = int(request.POST.get('quantity', 1))

    try:
        item_carrinho = ItemCarrinho.objects.get(id=id)
        if item_carrinho in carrinho.items.all():
            item_carrinho.quantidade = quantidade
            item_carrinho.save()
            carrinho.update_total()
            carrinho.save()
    except ItemCarrinho.DoesNotExist:
        print('Item não encontrado')

    return redirect('carrinho')

def comprar_agora(request, id): 

    livro = get_object_or_404(Livro, id=id)
    cliente = request.user  
    carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
    quantidade = int(request.GET.get('quantity', 1)) # Is returning 1, when it should be corresponding to the input value
    print(f"Quantidade: {quantidade}")
    
    item_carrinho, item_created = ItemCarrinho.objects.get_or_create(livro=livro, defaults={'quantidade': quantidade, 'preco': livro.preco})

    if not item_created:
        item_carrinho.quantidade += quantidade
    else:
        item_carrinho.quantidade = quantidade
        print(item_carrinho.quantidade)
    item_carrinho.save()


    carrinho.items.add(item_carrinho)
    carrinho.update_total()
    carrinho.save()

    context = {
        'carrinho': carrinho,
        'cliente': cliente,
        }
    return render(request, 'elibrosLoja/carrinho.html', context=context)

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


def admin(request):
    cliente = request.user

    context = {
        'cliente': cliente,
    }
    return render(request, 'elibrosLoja/admin/home.html', context=context)
    