from django.db import models

class Endereco(models.Model):
    cep = models.IntegerField() 
    uf = models.CharField(max_length=2)
    cidade = models.CharField(max_length=30)
    bairro = models.CharField(max_length=50)
    rua = models.CharField(max_length=100)
    numero = models.IntegerField()
    complemento = models.CharField(max_length=30)