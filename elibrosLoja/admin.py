from django.contrib import admin
from .models import *
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin
from .models.historical_admin import CustomSimpleHistoryAdmin
from django.core.exceptions import ObjectDoesNotExist
from django import forms
from utils.imagekit_config import upload_image_to_imagekit, delete_image_from_imagekit

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

class LivroAdminForm(forms.ModelForm):
    """Formulário customizado para upload de capa via ImageKit"""
    capa = forms.ImageField(
        required=False, 
        label='Capa do Livro',
        help_text='Envie uma imagem para a capa do livro (será salva no ImageKit.io)'
    )
    
    class Meta:
        model = Livro
        fields = '__all__'

class LivroAdmin(CustomSimpleHistoryAdmin):
    form = LivroAdminForm
    readonly_fields = ['img_preview', 'capa_url', 'capa_file_id']
    
    list_display = ['titulo','img_preview', 'get_autores_display', 'editora', 'preco', 'get_generos', 'get_categorias']

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'subtitulo', 'autor', 'editora', 'ISBN')
        }),
        ('Publicação', {
            'fields': ('data_de_publicacao', 'ano_de_publicacao')
        }),
        ('Capa', {
            'fields': ('capa', 'img_preview', 'capa_url', 'capa_file_id'),
            'description': 'Faça upload da capa do livro. A imagem será armazenada no ImageKit.io'
        }),
        ('Conteúdo', {
            'fields': ('sinopse', 'genero', 'categoria')
        }),
        ('Preços e Estoque', {
            'fields': ('preco', 'desconto', 'quantidade', 'qtd_vendidos')
        }),
    )

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
        
        # Processar upload da capa para ImageKit
        capa_file = form.cleaned_data.get('capa')
        if capa_file:
            # Se está editando um livro existente, pegar o file_id antigo do banco
            old_file_id = None
            if change and obj.pk:
                try:
                    old_livro = Livro.objects.get(pk=obj.pk)
                    old_file_id = old_livro.capa_file_id
                except Livro.DoesNotExist:
                    pass
            
            # Deletar capa antiga do ImageKit se existir
            if old_file_id:
                delete_image_from_imagekit(old_file_id)
            
            # Fazer upload da nova capa
            upload_result = upload_image_to_imagekit(
                file=capa_file,
                file_name=capa_file.name,
                folder='livros',
                tags=['capa', f'livro_{obj.ISBN}']
            )
            
            if upload_result:
                obj.capa_url = upload_result['url']
                obj.capa_file_id = upload_result['file_id']
            else:
                from django.contrib import messages
                messages.warning(request, 'Erro ao fazer upload da capa para o ImageKit.io')
        
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


# === ADMIN DE AVALIAÇÕES ===

@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ['livro', 'usuario', 'curtidas', 'data_publicacao']
    list_filter = ['data_publicacao', 'livro__categoria']
    search_fields = ['livro__titulo', 'usuario__username', 'texto']
    readonly_fields = ['data_publicacao', 'curtidas']
    ordering = ['-data_publicacao']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('usuario', 'livro')
        }),
        ('Conteúdo', {
            'fields': ('texto',)
        }),
        ('Estatísticas', {
            'fields': ('curtidas', 'data_publicacao'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('usuario', 'livro')


@admin.register(CurtidaAvaliacao)
class CurtidaAvaliacaoAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'avaliacao_info', 'data_curtida']
    list_filter = ['data_curtida']
    search_fields = ['usuario__username', 'avaliacao__livro__titulo']
    readonly_fields = ['data_curtida']
    
    def avaliacao_info(self, obj):
        return f'{obj.avaliacao.livro.titulo}'
    avaliacao_info.short_description = 'Avaliação'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('usuario', 'avaliacao__livro')
