from django.db import models
from .pedido import Pedido
from .livro import Livro
from validators import *
from accounts.models import Cliente



class LivroPedido(models.Model):
    valor = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    pedido = models.ForeignKey(Pedido, related_name="Pedido_container", on_delete=models.CASCADE)
    livro = models.ForeignKey(Livro, related_name="livro_de_um_pedido", on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, related_name="livro_pedido_cliente", on_delete=models.CASCADE, null=True)
