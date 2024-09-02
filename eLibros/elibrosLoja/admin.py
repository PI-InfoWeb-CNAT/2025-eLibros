from django.contrib import admin
from .models import *

class EnderecoAdmin(admin.ModelAdmin):
    model = Endereco
    list_display = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf',]

class LivroAdmin(admin.ModelAdmin):
    model = Livro

class LivroPedidoAdmin(admin.ModelAdmin):
    model = LivroPedido

class PedidoAdmin(admin.ModelAdmin):
    model = Pedido


admin.register(Endereco, EnderecoAdmin, Livro, LivroPedido, Pedido)
