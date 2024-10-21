from django.db import models

from validators import *

from elibrosLoja.models.generoLiterario import GeneroLiterario
from elibrosLoja.models.categoria import Categoria

from django.conf import settings
from django.utils.html import mark_safe

class Livro(models.Model):
    titulo = models.CharField(null=False, max_length=200)
    subtitulo = models.CharField(null=True, blank=True, max_length=200)
    autor = models.CharField(null=False, max_length=150)

    data_de_publicacao = models.DateField(null=True, blank=True, validators=[nao_e_no_futuro])
    ano_de_publicacao = models.IntegerField(null=True, blank=True, validators=[nao_negativo, nao_nulo, nao_e_no_futuro])

    capa = models.ImageField(upload_to='capas/', null=True, blank=True)
    ISBN = models.CharField(unique=True, max_length=15)
    sinopse = models.TextField(blank=True, null=True)
    editora = models.CharField(max_length=100, )

    data_de_adicao = models.DateTimeField(default=datetime.datetime.now())

    preco = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo])
    desconto = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    quantidade = models.IntegerField(validators=[nao_negativo])
    qtd_vendidos = models.IntegerField(default=0, validators=[nao_negativo], verbose_name='Vendidos')

    genero_literario = models.ManyToManyField(GeneroLiterario, related_name="Genero_Literario_do_Livro", blank=True)
    categoria = models.ManyToManyField(Categoria, related_name="Categoria_do_Livro", blank=True) 

    def clean(self):
        if not self.data_de_publicacao and not self.ano_de_publicacao:
            raise ValidationError('Ou data_de_publicacao ou ano_de_publicacao devem estar presentes')

    def __str__(self):
        return self.titulo
    
    def img_preview(self): #new
        if self.capa:
            return mark_safe(f'<img src="{self.capa.url}" width="100"/>')
        else:
            placeholder_url = settings.STATIC_URL + 'images/placeholder.png'
            return mark_safe(f'<img src="{placeholder_url}" width="100"/>')
        
    def save(self, *args, **kwargs):
        self.data_de_adicao = datetime.datetime.now()
        super().save(*args, **kwargs)