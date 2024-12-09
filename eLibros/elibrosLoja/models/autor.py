from django.db import models
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords

class Autor(models.Model):
    nome = models.CharField(max_length=100)

    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='autores_criados', null=True, blank=True)
    historico = HistoricalRecords(user_model=Administrador)

    def __str__(self):
        return self.nome

    @property
    def _history_user(self):
        return self.criado_por
    
    @_history_user.setter
    def _history_user(self, value):
        if isinstance(value, Administrador):
            self.criado_por = value
        else:
            self.criado_por = Administrador.objects.get(user=value)

    class Meta:
        verbose_name_plural = "Autores"