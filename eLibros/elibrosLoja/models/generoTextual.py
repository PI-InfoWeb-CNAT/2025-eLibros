from django.db import models
from validators import *


class GeneroTextual(models.Model):
    nome = models.TextField(unique=True, validators=[nao_nulo])