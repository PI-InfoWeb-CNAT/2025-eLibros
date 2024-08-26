from django.db import models
from models import Pedido, Livro

from validators import *

from django.apps import apps
Cliente = apps.get_model('accounts', 'Cliente')


class LivroPedido(models.Model):
    valor = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    pedido = models.ForeignKey(Pedido, related_name="Pedido_container", on_delete=models.SET_NULL)
    livro = models.ForeignKey(Livro, related_name="livro_de_um_pedido", on_delete=models.SET_NULL)