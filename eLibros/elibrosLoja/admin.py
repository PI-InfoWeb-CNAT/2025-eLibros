from django.contrib import admin
from .models import *

class EnderecoAdmin(admin.ModelAdmin):
    pass
    # list_display = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf',]

class LivroAdmin(admin.ModelAdmin):
    pass

class LivroPedidoAdmin(admin.ModelAdmin):
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
admin.site.register(LivroPedido, LivroPedidoAdmin)
admin.site.register(GeneroTextual, GeneroTextualAdmin)
admin.site.register(GeneroLivro, GeneroLivroAdmin)
