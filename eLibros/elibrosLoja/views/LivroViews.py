from elibrosLoja.models import Livro, Categoria, GeneroLiterario
from django.shortcuts import render, get_object_or_404 
import random
import re

def remove_special_characters(text):
  special_chars = re.compile(r'[^a-zA-Z0-9]')
  return special_chars.sub('', text)

class LivroViews:
    def Inicio(request):
        cliente = request.user
        livro = request.GET.get('livro')
        livros = Livro.objects.all()
        generos = GeneroLiterario.objects.all()

        livros_filtrados = []
        
        if livro is not None:
            livros = livros.filter(titulo__contains=livro)

        generos = list(generos)
        random.shuffle(generos)

        for genero in generos:
            if livros.filter(genero_literario=genero).exists():
                livros_filtrados.append({
                    'genero': genero.nome,
                    'livros': livros.filter(genero_literario=genero),
                })
        # livros_indicacoes = None
        # if livros.filter(categoria=Categoria.objects.get(nome='Indicações do eLibros')).exists(): 
        #     livros_indicacoes = livros.filter(categoria=Categoria.objects.get(nome='Indicações do eLibros'))
        # else: pass

        context = {
            'livros': livros,
            # 'livros_indicacoes': livros_indicacoes,
            'livros_filtrados_por_genero': livros_filtrados,
            'cliente': cliente,
        }

        return render(request, 'elibrosLoja/inicio.html', context=context, status=200)

    def acervo(request):
        
        livros = Livro.objects.all()


        generos = list(GeneroLiterario.objects.all())
        genero = random.choice(generos)

        while not livros.filter(genero_literario=genero).exists():
            genero = random.choice(generos)
        else:
            livros_genero = {
                'categoria_clean': remove_special_characters(genero.nome),
                'categoria': 'Livros de ' + genero.nome,
                'livros': livros.filter(genero_literario=genero),
            }
    

        lista_livros = []
        categorias = Categoria.objects.all()

        for categoria in categorias:
            if livros.filter(categoria=categoria).exists():
                lista_livros.append({
                    'categoria_clean': remove_special_characters(categoria.nome),
                    'categoria': categoria.nome,
                    'livros': livros.filter(categoria=categoria),
                })
        
        lista_livros.append(livros_genero)
        random.shuffle(lista_livros)
        

        context = {
            'lista_livros': lista_livros
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
