from django.contrib import admin

from models import *

from django.apps import apps
Cliente = apps.get_model('accounts', 'Cliente')

admin.register(Endereco, Livro, LivroPedido, Pedido, Cliente)
