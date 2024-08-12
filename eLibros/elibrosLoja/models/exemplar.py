from django.db import models
from validators import *

from pedido import Pedido


class Exemplar(models.Model):
    preco = models.DecimalField(max_digits=5, decimal_places=2)
    desconto = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    esta_disponivel = models.BooleanField()

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, null=True)