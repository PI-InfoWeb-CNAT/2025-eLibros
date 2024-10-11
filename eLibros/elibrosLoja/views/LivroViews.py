from elibrosLoja.models import Livro, GeneroTextual, Categoria
from django.shortcuts import render, get_object_or_404 
import random


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
