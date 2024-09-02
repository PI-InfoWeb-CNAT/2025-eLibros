from turtle import ondrag
from django.db import models

from validators import *

from elibrosLoja.models.generoTextual import GeneroTextual

class Livro(models.Model):
    titulo = models.CharField(null=False, max_length=200, validators=[verificar_vazio])
    autor = models.CharField(null=False, max_length=150, validators=[verificar_vazio])

    data_de_publicacao = models.DateField(validators=[nao_e_no_futuro])

    capa = models.ImageField()
    ISBN = models.CharField(unique=True, max_length=15, validators=[verificar_vazio])
    sinopse = models.TextField(validators=[verificar_vazio])
    editora = models.CharField(max_length=100, validators=[verificar_vazio])

    preco = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    desconto = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    quantidade = models.IntegerField(validators=[nao_negativo])

    genero = models.ManyToManyField(GeneroTextual, related_name="Genero_do_Livro") #mais de um gênero em um livro

    def __str__(self):
        return self.titulo