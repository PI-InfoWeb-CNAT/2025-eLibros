from django.db import models
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords


class Genero(models.Model):
    nome = models.CharField(unique=True, max_length=50)

    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='generos_criados', null=True, blank=True)
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
        return self.nome
    
    class Meta:
        verbose_name = "Gênero"
        verbose_name_plural = "Gêneros"
