import uuid
from django.views.generic import TemplateView
from elibrosLoja.models import Livro, GeneroTextual, Categoria, Carrinho, ItemCarrinho
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import random
import json 
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


def atualizar_carrinho(request):
    data = json.loads(request.body)
    id = data['id']
    action = data['action']
    quantidade = data['quantidadeAdicionada']

    # livro = Livro.objects.get(id=id)
    if request.user.is_authenticated:
        cliente = request.user
        carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
    else:
        session_id = request.session.get('session_id', str(uuid.uuid4()))
        request.session['session_id'] = session_id
        carrinho, created = Carrinho.objects.get_or_create(session_id=session_id)
    
    if action in ['adicionarAoCarrinho', 'comprarAgora']: #estamos lidando com um Livro
        livro = Livro.objects.get(id=id)

        item_carrinho, item_created = ItemCarrinho.objects.get_or_create(
            livro=livro,
            defaults={'quantidade': int(quantidade), 'preco': livro.preco}
        )
        
        if not item_created:
            item_carrinho.quantidade += int(quantidade) 
        else:
            item_carrinho.quantidade = int(quantidade)

        item_carrinho.save()
        if item_carrinho not in carrinho.items.all():
            carrinho.items.add(item_carrinho)
        message = 'Item foi adicionado ao carrinho'

        cart_item_count = carrinho.numero_itens
        if action == 'comprarAgora':
            return JsonResponse({'redirect': True, 'url': '/carrinho/'}, safe=False)
    else:                                               #estamos lidando com um ItemCarrinho
        item_carrinho = ItemCarrinho.objects.get(id=id)
        if action == 'deletar':
            if item_carrinho in carrinho.items.all():
                carrinho.items.remove(item_carrinho)
                item_carrinho.delete()
                message = 'Item foi removido do carrinho'
            else:
                message = 'Tentou-se removr Item mas ele não está no carrinho'
        else:
            if action == 'adicionar':
                item_carrinho.quantidade += 1
            elif action == 'remover' and item_carrinho.quantidade > 1:
                item_carrinho.quantidade -= 1
      
            item_carrinho.save()
            carrinho.save()
            message = 'Item foi atualizado ao carrinho'

    
    cart_item_count = carrinho.numero_itens
    return JsonResponse({'message': message, 'cartItemCount': cart_item_count}, safe=False)
    

def ver_carrinho(request):   
    context = {
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
    