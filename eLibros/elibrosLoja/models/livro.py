from django.db import models

from validators import *

class Livro(models.Model):
    titulo = models.CharField(null=False, max_length=200, validators=[verificar_vazio])
    autor = models.CharField(null=False, max_length=150, validators=[verificar_vazio])
    data_de_publicacao = models.DateField()
    capa = models.ImageField()
    ISBN = models.CharField(unique=True, validators=[verificar_vazio])
    descricao = models.TextField(validators=[verificar_vazio])
    editora = models.CharField(max_length=100, validators=[verificar_vazio])

    def __str__(self):
        return self.titulo