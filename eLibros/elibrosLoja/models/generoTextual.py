from django.db import models
from validators import *


class GeneroTextual(models.Model):
    nome = models.CharField(unique=True, max_length=30, validators=[nao_nulo])

    def __str__(self):
        return self.nome