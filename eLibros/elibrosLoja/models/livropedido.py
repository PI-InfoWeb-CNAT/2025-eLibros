from django.db import models

# from elibrosLoja.models.pedido import Pedido
from elibrosLoja.models.livro import Livro


from validators import *

class LivroPedido(models.Model):
    valor = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    livro = models.ForeignKey(Livro, related_name="livro_de_um_pedido", on_delete=models.CASCADE)
