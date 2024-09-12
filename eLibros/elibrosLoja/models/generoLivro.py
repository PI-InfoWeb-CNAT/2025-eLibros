from django.db import models

from elibrosLoja.models.generoTextual import GeneroTextual
from elibrosLoja.models.livro import Livro

class GeneroLivro(models.Model):
    generoTextual = models.OneToOneField(GeneroTextual, on_delete=models.CASCADE)
    livro = models.OneToOneField(Livro, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.generoTextual} | {self.livro} "
