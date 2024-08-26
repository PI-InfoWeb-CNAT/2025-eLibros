from django.db import models
from accounts.models import Cliente
from .livro import Livro
from validators import *

class Pedido(models.Model):
    cliente = models.ForeignKey(Cliente, null=False, related_name="cliente_do_pedido", on_delete=models.CASCADE)
    livro = models.ForeignKey(Livro, null=False, related_name="livro_do_pedido", on_delete=models.CASCADE)
    status = models.CharField(max_length=50, validators=[nao_nulo], default="nao_confirmado/processando")
    data_de_pedido = models.DateTimeField(auto_now_add=True)
    entrega_estimada = models.DateTimeField()


#nao_confirmado/processando, confirmado_e_nao_enviado, confirmado_e_enviado, entregue 