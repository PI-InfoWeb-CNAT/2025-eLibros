from django.db import models
from django.conf import settings
from elibrosLoja.models.endereco import Endereco
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords

from validators import *

class Cliente(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    endereco = models.ForeignKey(Endereco, blank=True, on_delete=models.SET_NULL, null=True)
    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='clientes_criados', null=True, blank=True)
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

    def __str__(self):
        return f'{self.user.nome} (Cliente) - {self.user.email}'
    