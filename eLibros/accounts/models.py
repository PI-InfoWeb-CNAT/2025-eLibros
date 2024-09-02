from django.contrib.auth.models import AbstractUser
from django.db import models

from elibrosLoja.models.endereco import Endereco

from validators import *

class Cliente(AbstractUser):
    
    '''
    - username --> obrigatório por padrão
    - password --> obrigatório


    CAMPOS OPCIONAIS:

    - first_name
    - last_name
    ...
    - last_login
    - date_joined

    '''

    nome = models.CharField(blank=True, null=True, max_length=100, validators=[nao_nulo])
    CPF = models.CharField(blank=True, null=True, max_length=15)

    genero_choices = (
        ("F", "Feminino"),
        ("M", "Masculino"),
        ("NB", "Não-binário"),
        ("PND", "Prefiro não dizer"),
        ("OU", "Outro")
    )

    genero = models.CharField(max_length=20, choices=genero_choices, default="F", null=True, blank=True, verbose_name="Gênero")
    outro_genero = models.CharField(max_length=50, blank=True, null=True, verbose_name="Outro Gênero")
    dt_nasc = models.DateField(blank=True, null=True, verbose_name="Data de Nascimento")

    enderecos = models.ManyToManyField(Endereco, related_name="enderecos_do_cliente", blank=True)

    def __str__(self):
        return self.username