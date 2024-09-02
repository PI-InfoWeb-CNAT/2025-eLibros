from django.db import models

from validators import *

from elibrosLoja.models.generoTextual import GeneroTextual

from django.utils.html import mark_safe

class Livro(models.Model):
    titulo = models.CharField(null=False, max_length=200, validators=[verificar_vazio])
    autor = models.CharField(null=False, max_length=150, validators=[verificar_vazio])

    data_de_publicacao = models.DateField(null=True, blank=True, validators=[nao_e_no_futuro])
    ano_de_publicacao = models.IntegerField(null=True, blank=True, validators=[nao_negativo, nao_nulo])

    capa = models.ImageField(upload_to='capas/', null=True, blank=True)
    ISBN = models.CharField(unique=True, max_length=15, validators=[verificar_vazio])
    sinopse = models.TextField(validators=[verificar_vazio])
    editora = models.CharField(max_length=100, validators=[verificar_vazio])

    preco = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    desconto = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    quantidade = models.IntegerField(validators=[nao_negativo])

    genero = models.ManyToManyField(GeneroTextual, related_name="Genero_do_Livro") #mais de um gênero em um livro

    def clean(self):
        if not self.data_de_publicacao and not self.ano_de_publicacao:
            raise ValidationError('Ou data_de_publicacao ou ano_de_publicacao devem estar presentes')

    def __str__(self):
        return self.titulo
    
    def img_preview(self): #new
        if self.capa:
            return mark_safe(f'<img src="{self.capa.url}" width="100"/>')
        return ""