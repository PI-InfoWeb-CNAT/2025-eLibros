from elibrosLoja.models import Livro, Categoria, Genero, Autor
from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from django.http import HttpResponse
from django.template.loader import render_to_string
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
        generos = Genero.objects.all()

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

        # categoria = Categoria.objects.get(nome='Indicações do eLibros')
        # livros_indicacoes = None
        # if livros.filter(categoria=Categoria.objects.get(nome='Indicações do eLibros')).exists(): 
        #     livros_indicacoes = livros.filter(categoria=categoria)
        # else: pass

        context = {
            'livros': livros,
            # 'livros_indicacoes': livros_indicacoes,
            'catOUgen_clean': remove_special_characters('Indicações do eLibros'),
            # 'catOUgen': categoria,
            # 'livros_filtrados_por_genero': livros_filtrados,
            'cliente': cliente,
        }

        return render(request, 'elibrosLoja/inicio.html', context=context, status=200)

    def acervo(request):     
        livros = Livro.objects.all()

        pesquisa = request.GET.get('pesquisa', '')
        if pesquisa:
            return redirect('explorar', busca=pesquisa)

        generos = list(Genero.objects.all())
        genero = random.choice(generos)

        while not livros.filter(genero_literario=genero).exists():
            genero = random.choice(generos)
        else:
            livros_genero = {
                'catOUgen_clean': remove_special_characters(genero.nome),
                'catOUgen': genero,
                'livros': livros.filter(genero_literario=genero),
            }

        lista_livros = []
        categorias = Categoria.objects.all()

        for categoria in categorias:
            if livros.filter(categoria=categoria).exists():
                lista_livros.append({
                    'catOUgen_clean': remove_special_characters(categoria.nome),
                    'catOUgen': categoria,
                    'livros': livros.filter(categoria=categoria),
                })

        lista_livros.append(livros_genero)
        random.shuffle(lista_livros)

        context = {
            'lista_livros': lista_livros,
            'generos': Genero.objects.all(),
            'autor': Autor.objects.all(),
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

    def explorar(request, busca=None):
        
        livros = Livro.objects.all()
        busca = request.GET.get('pesquisa', '')
        print(busca)

        if busca:
            livros = Livro.objects.filter(
            Q(titulo__icontains=busca) |
            Q(autor__nome__icontains=busca)
        ).distinct()
            
        print(livros)

        if not livros.exists():
                livros = Livro.objects.all()

        genero = request.GET.get('genero', '')
        autor = request.GET.get('autor', '')
        data = request.GET.get('data', '')

        if genero:
           print(genero)
           livros = livros.filter(genero_literario__nome=genero)
        if autor:
            print(autor)
            livros = livros.filter(autor__nome=autor)
        if data:
            print(data)
            if data == "+":
                livros = livros.filter(ano_de_publicacao__gt=2010)
            else:
                data = int(data)
                livros= livros.filter(
                    ano_de_publicacao__gte=data,
                    ano_de_publicacao__lt=data+10
                )
        
        generos = Genero.objects.all()
        autores = Autor.objects.all()
        context = {
            'lista_livros': livros,
            'generos': generos,
            'autores': autores,
            'termo_pesquisa': busca,
        }
        
        return render(request, 'elibrosLoja/explorar.html', context=context)

