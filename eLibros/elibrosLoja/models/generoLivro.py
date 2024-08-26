from django.db import models

from models import GeneroTextual, Livro

class GeneroLivro(models.Model):
    generoTextual = models.ForeignKey(GeneroTextual, on_delete=models.SET_NULL, primary_key=True)
    livro = models.ForeignKey(Livro, on_delete=models.SET_NULL, primary_key=True)
