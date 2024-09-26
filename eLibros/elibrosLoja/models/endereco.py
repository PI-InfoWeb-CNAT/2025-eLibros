from django.db import models

class Endereco(models.Model):
    cep = models.CharField(max_length=9)
    uf = models.CharField(max_length=2)
    cidade = models.CharField(max_length=30)
    bairro = models.CharField(max_length=50)
    rua = models.CharField(max_length=100)
    numero = models.IntegerField()
    complemento = models.CharField(max_length=30, blank=True, null=True)
    identificacao = models.CharField(max_length=30)

    def __str__(self) -> str:
        return f"{self.rua}, {self.numero} - {self.complemento} - {self.bairro}, {self.cidade} - {self.uf} - {self.cep}"