from django.db import models
from validators import *

from simple_history.models import HistoricalRecords
from elibrosLoja.models.itemcarrinho import ItemCarrinho
from elibrosLoja.models.cliente import Cliente
from elibrosLoja.models.administrador import Administrador
from elibrosLoja.models.endereco import Endereco

import random

class Pedido(models.Model):

    def gerar_numero_pedido():
        numero_pedido = ""
        for i in range(12):
            numero_pedido += str(random.randint(0, 9))
        return numero_pedido

    numero_pedido = models.CharField(max_length=12, primary_key=True, default=gerar_numero_pedido())

    cliente = models.ForeignKey(Cliente, null=False, related_name="cliente_do_pedido", on_delete=models.CASCADE)
    itens = models.ManyToManyField(ItemCarrinho, related_name="itens_do_pedido")
    endereco = models.ForeignKey(Endereco, null=False, related_name="endereco_do_pedido", on_delete=models.CASCADE, default=None)

    status = models.CharField(max_length=50, validators=[nao_nulo], default="PRO")
    data_de_pedido = models.DateTimeField()
    entrega_estimada = models.DateTimeField()
    data_de_entrega = models.DateTimeField(blank=True, null=True)

    valor_total = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo], default=0.0)
    desconto = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo], default=0.0, blank=True, null=True)

    quantia_itens = models.IntegerField(validators=[nao_negativo], default=0)

    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='pedidos_criados', null=True, blank=True)

    historico = HistoricalRecords(user_model=Administrador)

    @property
    def _history_user(self):
        return self.criado_por
    
    @_history_user.setter
    def _history_user(self, value):
        if isinstance(value, Administrador):
            self.criado_por = value
        else:
            self.criado_por = Administrador.objects.get(user=value)
    
    def confirmado(self):
        if self.status == 'CON': return True
        else: return False

    def __str__(self):
        return f"Pedido Nº {self.numero_pedido}"


'''
TipoStatus{
PRO - Em processamento
CAN - Cancelado
CON - Confirmado
ENV - Enviado
ENT - Entregue
}
'''
