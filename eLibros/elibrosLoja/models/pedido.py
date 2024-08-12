from django.db import models

from django.apps import apps

CustomUser = apps.get_model('accounts', 'CustomUser')

class Pedido(models.Model):
    cliente = models.ForeignKey(CustomUser, null=False, related_name="cliente_do_pedido", on_delete=models.SET_NULL)
    status = models.CharField(max_length=50)
    data_de_pedido = models.DateTimeField(auto_now_add=True)
    entrega_estimada = models.DateTimeField()


#nao_confirmado/processando, confirmado_e_nao_enviado, confirmado_e_enviado, entregue 