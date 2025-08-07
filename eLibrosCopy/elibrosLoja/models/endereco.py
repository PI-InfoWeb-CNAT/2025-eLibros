from django.db import models
from elibrosLoja.models.administrador import Administrador
from django.conf import settings
from simple_history.models import HistoricalRecords

class Endereco(models.Model):
    cep = models.CharField(max_length=9)
    uf = models.CharField(max_length=2)
    cidade = models.CharField(max_length=30)
    bairro = models.CharField(max_length=50)
    rua = models.CharField(max_length=100)
    numero = models.IntegerField()
    complemento = models.CharField(max_length=30, blank=True, null=True)
    identificacao = models.CharField(max_length=30, default="Endereço", blank=True, null=True)


    historico = HistoricalRecords()

    

    def __str__(self) -> str:
        return f"{self.rua}, {self.numero} - {self.complemento} - {self.bairro}, {self.cidade} - {self.uf} - {self.cep}"

    class Meta:
        verbose_name = "Endereço"
        verbose_name_plural = "Endereços"