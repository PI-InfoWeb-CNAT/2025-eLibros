from distutils.log import error
from django.db import models

from elibrosLoja.models.pedido import Pedido
from elibrosLoja.models.livro import Livro

from validators import *
from accounts.models import Cliente

class LivroPedido(models.Model):
    valor = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    pedido = models.ForeignKey(Pedido, related_name="Pedido_container", on_delete=models.CASCADE)
    livro = models.ForeignKey(Livro, related_name="livro_de_um_pedido", on_delete=models.CASCADE)
