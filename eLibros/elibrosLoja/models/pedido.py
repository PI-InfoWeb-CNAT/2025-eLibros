from django.db import models
from validators import *


from elibrosLoja.models.livropedido import LivroPedido

import random

class Pedido(models.Model):

    def gerar_numero_pedido():
        numero_pedido = ""
        for i in range(12):
            numero_pedido += str(random.randint(0, 9))
        return numero_pedido

    numero_pedido = models.CharField(max_length=12, primary_key=True, default=gerar_numero_pedido())
    cliente = models.ForeignKey('accounts.Cliente', null=False, related_name="cliente_do_pedido", on_delete=models.CASCADE)

    livros_do_pedido = models.ManyToManyField(LivroPedido, related_name="livro_do_pedido")

    status = models.CharField(max_length=50, validators=[nao_nulo], default="nao_confirmado/processando")
    data_de_pedido = models.DateTimeField(auto_now_add=True)
    entrega_estimada = models.DateTimeField()

    def __str__(self):
        return f"{self.cliente} | {self.status} "


#nao_confirmado/processando, confirmado_e_nao_enviado, confirmado_e_enviado, entregue 