from django.db import models

from validators import *

from elibrosLoja.models.genero import Genero
from elibrosLoja.models.categoria import Categoria
from elibrosLoja.models.autor import Autor
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords

from django.conf import settings
from django.utils.html import mark_safe

class Livro(models.Model):
    titulo = models.CharField(null=False, max_length=200, verbose_name='Título')
    subtitulo = models.CharField(null=True, blank=True, max_length=200, verbose_name='Subtítulo')
    autor = models.ManyToManyField(Autor, related_name="Autor_do_Livro", blank=True, verbose_name='Autor(es)')
    editora = models.CharField(max_length=100, default='Editora não informada', verbose_name='Editora')
    ISBN = models.CharField(unique=True, max_length=15)
    data_de_publicacao = models.DateField(null=True, blank=True, validators=[nao_e_no_futuro], verbose_name='Data de Publicação')
    ano_de_publicacao = models.IntegerField(null=True, blank=True, validators=[nao_negativo, nao_nulo, nao_e_no_futuro], verbose_name='Ano de Publicação')
    capa = models.ImageField(upload_to='capas/', null=True, blank=True, verbose_name='Capa')
    sinopse = models.TextField(blank=True, null=True, verbose_name='Sinopse')
    genero_literario = models.ManyToManyField(Genero, related_name="Genero_Literario_do_Livro", blank=True)
    categoria = models.ManyToManyField(Categoria, related_name="Categoria_do_Livro", blank=True)
    
    preco = models.DecimalField(max_digits=5, decimal_places=2, validators=[nao_negativo, nao_nulo], default=0.00, verbose_name='Preço')
    desconto = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name='Desconto')

    quantidade = models.IntegerField(validators=[nao_negativo], verbose_name='Quantidade')
    qtd_vendidos = models.IntegerField(default=0, validators=[nao_negativo], verbose_name='Vendidos')


    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='livros_criados', null=True, blank=True)
    

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


    def clean(self):
        if not self.data_de_publicacao and not self.ano_de_publicacao:
            raise ValidationError('Ou data_de_publicacao ou ano_de_publicacao devem estar presentes')

    def __str__(self):
        return self.titulo

    def get_autores_display(self):
        autores = self.autor.all()
        return ", ".join([autor.nome for autor in autores]) if autores else "Sem autor"
    get_autores_display.short_description = 'Autores'

    def get_primeiro_autor(self):
        # return f'{self.autor.first()}...'
        autor = self.autor.first().nome
        if len(autor) > 20:
            while len(autor) > 20:
                palavras = autor.split(" ")
                palavras.pop(-1)
                autor = " ".join(palavras)
            return autor + "..."
        else:
            return autor
            
    def get_subtitulo_display(self):
        sub = self.subtitulo
        if len(sub) > 16:
            while len(sub) > 14:
                palavras = sub.split(" ")
                palavras.pop(-1)
                sub = " ".join(palavras)
            return sub + "..."
        else: return sub

    def get_titulo_display(self):
        tit = self.titulo
        if len(tit) > 25:
            tit1 = self.titulo
            while len(tit1) > 13:
                palavras = tit1.split(" ")
                palavras.pop(-1)
                tit1 = ' '.join(palavras)
            if len(tit1) == 0:
                return tit[0]
            tit_full = tit.split(" ")
            tit1_palavras = tit1.split(" ")
            for i in range(len(tit1_palavras)):
                tit_full.pop(i)
            tit2 = ' '.join(tit_full)
            while len(tit2) > 11:
                palavras = tit2.split(' ')
                palavras.pop(-1)
                tit2 = ' '.join(palavras)
            return tit1 + ' ' + tit2 + '...'
        else: 
            return self.titulo

    def img_preview(self): #new
        if self.capa:
            return mark_safe(f'<img src="{self.capa.url}" width="100"/>')
        else:
            placeholder_url = settings.STATIC_URL + 'images/placeholder.png'
            return mark_safe(f'<img src="{placeholder_url}" width="100"/>')
        
    