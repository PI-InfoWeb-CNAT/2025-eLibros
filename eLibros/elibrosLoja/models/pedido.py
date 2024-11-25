from django.db import models
from validators import *


from elibrosLoja.models.itemcarrinho import ItemCarrinho
from elibrosLoja.models.endereco import Endereco

import random

class Pedido(models.Model):

    def gerar_numero_pedido():
        numero_pedido = ""
        for i in range(12):
            numero_pedido += str(random.randint(0, 9))
        return numero_pedido

    numero_pedido = models.CharField(max_length=12, primary_key=True, default=gerar_numero_pedido())

    cliente = models.ForeignKey('accounts.Cliente', null=False, related_name="cliente_do_pedido", on_delete=models.CASCADE)
    itens = models.ManyToManyField(ItemCarrinho, related_name="itens_do_pedido")
    # endereco = models.ForeignKey(Endereco, null=False, related_name="endereco_do_pedido", on_delete=models.CASCADE, default=cliente.enderecos.all()[0])

    status = models.CharField(max_length=50, validators=[nao_nulo], default="nao_confirmado/processando")
    data_de_pedido = models.DateTimeField()
    entrega_estimada = models.DateTimeField()

    valor_total = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo], default=0.0)

    def __str__(self):
        return f"{self.cliente} | {self.status} "


#nao_confirmado/processando, confirmado_e_nao_enviado, confirmado_e_enviado, entregue 