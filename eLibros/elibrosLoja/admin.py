from django.contrib import admin
from .models import *
from django.utils.html import format_html

class EnderecoAdmin(admin.ModelAdmin):
    pass
    # list_display = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf',]

class ImageAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        return format_html('<img src="{}" style="max-width:200px; max-height:200px"/>'.format(obj.image.url))
    list_display = ['name','image_tag',]

class LivroAdmin(admin.ModelAdmin):
    readonly_fields = ['img_preview']
    list_display = ['titulo','img_preview', 'autor', 'editora', 'preco', 'desconto', 'quantidade', 'ISBN', 'get_generos']

    def get_generos(self, obj):
        return ", ".join([genero.nome for genero in obj.genero.all()])
    get_generos.short_description = 'Gêneros'

class CarrinhoAdmin(admin.ModelAdmin):
    pass

class ItemCarrinhoAdmin(admin.ModelAdmin):
    pass

class PedidoAdmin(admin.ModelAdmin):
    pass

class GeneroTextualAdmin(admin.ModelAdmin):
    pass

class GeneroLivroAdmin(admin.ModelAdmin):
    pass

admin.site.register(Endereco, EnderecoAdmin)
admin.site.register(Livro, LivroAdmin)
admin.site.register(Pedido, PedidoAdmin)
admin.site.register(Carrinho, CarrinhoAdmin)
admin.site.register(ItemCarrinho, ItemCarrinhoAdmin)
admin.site.register(GeneroTextual, GeneroTextualAdmin)
admin.site.register(GeneroLivro, GeneroLivroAdmin)
