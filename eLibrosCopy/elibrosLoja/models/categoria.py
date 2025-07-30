from django.db import models
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords


class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='categorias_criadas', null=True, blank=True)
    historico = HistoricalRecords(user_model=Administrador)

    @property
    def _history_user(self):
        return self.criado_por
    
    @_history_user.setter
    def _history_user(self, value):
        if isinstance(value, Administrador):
            self.criado_por = value
            print(f'Valor1: {value}')
        else:
            self.criado_por = Administrador.objects.get(user=value)
            print(f'Valor2: {value}')
            print(self.criado_por)

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"