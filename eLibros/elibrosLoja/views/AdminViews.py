from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from elibrosLoja.models import Livro, Pedido, GeneroLiterario, Categoria


permissoes_admin_elibros = {
    'livro': ['c', 'r', 'u', 'd'],
    'pedido': ['r', 'u', 'd'],
    'cliente': ['r', 'u', 'd'],
    'genero': ['c', 'r', 'd'],
    'categoria': ['c', 'r', 'd'],
    'endereco': ['c', 'r', 'u', 'd'],
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

    if classe != 'pedido' and classe != 'cliente':
        botao = True

    return render(request, 'elibrosLoja/admin/manter.html',
                  {'instancias': instancias,
                   'classe': classe,
                   'permissoes': permissoes_admin_elibros[classe],
                   'botao': botao, 
                   'renomear_classes': ['genero', 'categoria']
                   })

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
        
        # find fields from instance that are a relation to another model
        fields = instancia._meta.get_fields()
        relacoes = {}
        for field in fields:
            if field.is_relation:
                relacoes[field.name] = field.related_model.objects.all()
    else:
        instancia = None
    return render(request, 'elibrosLoja/admin/editar_instancia.html', {'instancia': instancia, 'relacoes': relacoes})

@login_required
def editar_instancia_postback(request, classe):
    
    if request.method == 'POST':
        if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:
            
            # get instance
            instancia = eval(classe.capitalize()).objects.get(id=request.POST['id'])

            # get fields passed by post
            fields = instancia._meta.get_fields()
            for field in fields:
                if field.name in request.POST:
                    setattr(instancia, field.name, request.POST[field.name])
            
            instancia.save()
    return redirect('listar_instancias', classe=classe)

@login_required
def criar_instancia(request, classe):
    if request.method == 'POST':
        if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:

            # get instance passed by post
            nova_instancia = eval(classe.capitalize()).objects.create(nome=request.POST['nome'])

            # get fields passed by post
            fields =  nova_instancia._meta.get_fields()
            for field in fields:
                if field.name in request.POST:
                    setattr(nova_instancia, field.name, request.POST[field.name])
            
            # se uma imagem tiver sido anexada, ou seja, é um livro
            if request.FILES: 
                 nova_instancia.imagem = request.FILES['imagem']

            nova_instancia.save()
    return redirect('listar_instancias', classe=classe)

@login_required
def excluir_instancia(request, classe, id):
    if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:
        instancia = eval(classe.capitalize()).objects.get(id=id)
    return render(request, 'elibrosLoja/admin/excluir_instancia.html', {'instancia': instancia}, status=200)

@login_required
def excluir_instancia_postback(request, classe):
    if request.method == 'POST':
        if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido']:
            try:
                instancia = eval(classe.capitalize()).objects.get(id=request.POST['id'])
            except Exception as e:
                print("Erro ao buscar instância: %s" % e)
                
            try:
                instancia.delete()
            except Exception as e:
                print("Erro ao deletar instância: %s" % e)  
    return redirect('listar_instancias', classe=classe)
