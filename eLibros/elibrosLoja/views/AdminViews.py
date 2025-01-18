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

fields_exclude = {
    'livro': ['id', 'historico', 'criado_por', 'livro_selecionado', 'capa'],
    'genero': ['id'],
    'categoria': ['id'],
    'cliente': ['id, criado_por, historico'],
    'pedido': ['id, criado_por, historico'],
    'cupom': ['id'],
}

ordem_livro = ['subtitulo', 'autor']

def get_h2(classe, instancia):

    if classe == 'livro':
        h2 = instancia.titulo
    elif classe == 'genero':
        h2 = instancia.nome
    elif classe == 'categoria':
        h2 = instancia.nome
    elif classe == 'cliente':
        if instancia.user.username:
            h2 = instancia.user.username
        else:
            h2 = instancia.user.email
    elif classe == 'pedido':
        h2 = instancia.id
    elif classe == 'cupom':
        h2 = instancia.codigo

    return h2

def get_fields(instancia):
    fields = instancia._meta.get_fields()
    field_values = []
    for field in fields:
        if field.concrete and not field.is_relation and field.name not in fields_exclude[instancia.__class__.__name__.lower()]:
            field_values.append({
                'name': field.name,
                'verbose_name': field.verbose_name,
                'value': getattr(instancia, field.name),
                'is_list': False
            })
        elif field.is_relation and field.name not in fields_exclude[instancia.__class__.__name__.lower()]:
            related_objects = getattr(instancia, field.name).all() if field.many_to_many else getattr(instancia, field.name)
            value = related_objects
            verbose_name = field.related_model._meta.verbose_name if hasattr(field, 'related_model') else field.verbose_name

            #converter de QuerySet para lista
            if field.many_to_many:
                value = list(value)
            elif value:
                value = [value]
                
            field_values.append({
                'name': field.name,
                'verbose_name': verbose_name,
                'value': value,
                'is_list': True
            })
    print(field_values)
    return field_values

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
    if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido', 'cupom']:
        instancia = eval(classe.capitalize()).objects.get(id=id)
        h2 = get_h2(classe, instancia)
        field_values = get_fields(instancia)
        
    else:
        instancia = None
        field_values = []
    
    return render(request, 'elibrosLoja/admin/ver_e_editar.html', {
        'instancia': instancia,
        'h2': h2,
        'classe': classe,
        'fields': field_values,
        'disabled': True,
    })

@login_required
def editar_instancia(request, classe, id):
    if classe in ['livro', 'genero', 'categoria', 'cliente', 'pedido', 'cupom']:
        instancia = eval(classe.capitalize()).objects.get(id=id)
        h2 = get_h2(classe, instancia)
        field_values = get_fields(instancia)
        
    else:
        instancia = None
        field_values = []
    
    return render(request, 'elibrosLoja/admin/editar_instancia.html', {
        'instancia': instancia,
        'h2': h2,
        'classe': classe,
        'fields': field_values,
        'disabled': True,
    })

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
