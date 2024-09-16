from django.db import models

class GeneroLiterario(models.Model):
    nome = models.CharField(unique=True, max_length=50)

    def __str__(self):
        return self.nome
