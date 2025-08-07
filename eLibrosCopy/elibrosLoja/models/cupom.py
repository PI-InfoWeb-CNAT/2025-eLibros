from django.db import models
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords
from django.utils import timezone

class Cupom(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    valor = models.IntegerField(null=False, default=0)
    
    escolhas ={
        "1": "porcentagem",
        "2": "decimal"
    }     

    tipo_valor = models.CharField(
        max_length = 1,
        choices = escolhas,
        default ="1"
    )
    
    ativo = models.BooleanField(default=True)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()

    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='cupons_criados', null=True, blank=True)
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
        if self.tipo_valor == "1":
            return f'{self.codigo} - {self.valor}% de desconto'
        else: return f'{self.codigo} - R$ {self.valor} de desconto'
    
    @property
    def get_validade(self):
        if timezone.now() > self.data_fim:
            self.ativo = False
            self.save()
        return self.ativo
    
    class Meta:
        verbose_name = "Cupom"
        verbose_name_plural = "Cupons"