from django.db import models

from .generoTextual import GeneroTextual
from .livro import Livro

class GeneroLivro(models.Model):
    generoTextual = models.OneToOneField(GeneroTextual, on_delete=models.CASCADE)
    livro = models.OneToOneField(Livro, on_delete=models.CASCADE)
