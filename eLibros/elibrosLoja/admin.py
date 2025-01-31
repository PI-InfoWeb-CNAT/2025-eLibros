from django.contrib import admin
from .models import *
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin
from .models.historical_admin import CustomSimpleHistoryAdmin
from django.core.exceptions import ObjectDoesNotExist

class ClienteAdmin(CustomSimpleHistoryAdmin):
    def save_model(self, request, obj, form, change):
        try:
            administrador = Administrador.objects.get(user=request.user)
        except ObjectDoesNotExist:
            raise ValueError("O usuário atual não está associado a um administrador.")

        if not obj.pk:
            obj.criado_por = administrador
        obj._history_user = administrador
        super().save_model(request, obj, form, change)

class AdministradorAdmin(SimpleHistoryAdmin):
    pass

class EnderecoAdmin(SimpleHistoryAdmin):
    pass
    # list_display = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf',]

class LivroAdmin(CustomSimpleHistoryAdmin):
    readonly_fields = ['img_preview']
    
    list_display = ['titulo','img_preview', 'get_autores_display', 'editora', 'preco', 'get_generos', 'get_categorias']


    def get_generos(self, obj):
        return ", ".join([genero.nome for genero in obj.genero.all()])
    get_generos.short_description = 'Gêneros Literários'

    def get_categorias(self, obj):
        return ", ".join([categoria.nome for categoria in obj.categoria.all()])
    get_categorias.short_description = 'Categorias'

    def save_model(self, request, obj, form, change):
        try:
            administrador = Administrador.objects.get(user=request.user)
        except ObjectDoesNotExist:
            raise ValueError("O usuário atual não está associado a um administrador.")

        if not obj.pk:
            obj.criado_por = administrador
        obj._history_user = administrador
        super().save_model(request, obj, form, change)

        if form.cleaned_data.get('autor'):
            obj.autor.set(form.cleaned_data['autor'])

class CarrinhoAdmin(SimpleHistoryAdmin):

  
    list_display = ['cliente', 'get_items', 'total']

    def get_items(self, obj):
        var = ''
        for item in obj.items.all():
            var += f'Quantidade: {item.quantidade} - {item.livro.titulo} - Preço: {item.preco}<br>'
        return var

class ItemCarrinhoAdmin(SimpleHistoryAdmin):
    
    list_display = ['carrinho', 'livro', 'quantidade', 'preco']

class PedidoAdmin(CustomSimpleHistoryAdmin):
   
    list_display = ['cliente', 'status', 'data_de_pedido', 'entrega_estimada', 'data_de_entrega', 'valor_total', 'desconto', 'quantia_itens', 'get_itens']
    def get_itens(self, obj):
        var = ''
        for item in obj.itens.all():
            var += f'Quantidade: {item.quantidade} - {item.livro.titulo} - Preço: {item.preco}<br>'
        return var
    
    def save_model(self, request, obj, form, change):
        try:
            administrador = Administrador.objects.get(user=request.user)
        except ObjectDoesNotExist:
            raise ValueError("O usuário atual não está associado a um administrador.")

        if not obj.pk:
            obj.criado_por = administrador
        obj._history_user = administrador
        super().save_model(request, obj, form, change)

class GeneroAdmin(CustomSimpleHistoryAdmin):
    def save_model(self, request, obj, form, change):
        try:
            administrador = Administrador.objects.get(user=request.user)
        except ObjectDoesNotExist:
            raise ValueError("O usuário atual não está associado a um administrador.")

        if not obj.pk:
            obj.criado_por = administrador
        obj._history_user = administrador
        super().save_model(request, obj, form, change)

class GeneroAdmin(CustomSimpleHistoryAdmin):
    def save_model(self, request, obj, form, change):
        try:
            administrador = Administrador.objects.get(user=request.user)
        except ObjectDoesNotExist:
            raise ValueError("O usuário atual não está associado a um administrador.")

        if not obj.pk:
            obj.criado_por = administrador
        obj._history_user = administrador
        super().save_model(request, obj, form, change)

class CategoriaAdmin(CustomSimpleHistoryAdmin):
    def save_model(self, request, obj, form, change):
        try:
            administrador = Administrador.objects.get(user=request.user)
        except ObjectDoesNotExist:
            raise ValueError("O usuário atual não está associado a um administrador.")

        if not obj.pk:
            obj.criado_por = administrador
        obj._history_user = administrador
        super().save_model(request, obj, form, change)

  

class CupomAdmin(CustomSimpleHistoryAdmin):
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Se a instância está sendo criada
            administrador = Administrador.objects.get(user=request.user)
            obj.criado_por = administrador
        super().save_model(request, obj, form, change)

class AutorAdmin(CustomSimpleHistoryAdmin):
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # Se a instância está sendo criada
            administrador = Administrador.objects.get(user=request.user)
            obj.criado_por = administrador
        super().save_model(request, obj, form, change)

admin.site.register(Endereco, EnderecoAdmin)
admin.site.register(Livro, LivroAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(Carrinho, CarrinhoAdmin)
admin.site.register(ItemCarrinho, ItemCarrinhoAdmin)
admin.site.register(Genero, GeneroAdmin)
admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Cupom, CupomAdmin)
admin.site.register(Autor, AutorAdmin)

admin.site.register(Administrador, AdministradorAdmin)
admin.site.register(Cliente, ClienteAdmin)
