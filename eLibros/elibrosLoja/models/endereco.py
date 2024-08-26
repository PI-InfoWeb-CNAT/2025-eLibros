from django.db import models

class Endereco(models.Model):
    cep = models.TextField(max_length=8) 
    uf = models.TextField(max_length=2)
    cidade = models.TextField()
    bairro = models.TextField()
    rua = models.TextField()
    numero = models.IntegerField()
    complemento = models.TextField()