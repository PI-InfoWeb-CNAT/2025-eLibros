from django.contrib.auth.models import AbstractUser
from django.db import models

from elibrosLoja.models.endereco import Endereco
from django.utils.html import mark_safe
from django.conf import settings
from validators import *

class Cliente(AbstractUser):
    
    '''
    AUTOMATIC FIELDS
    
    - username --> obrigatório por padrão
    - password --> obrigatório


   OPTIONAL FIELDS

    - first_name
    - last_name
    ...
    - last_login
    - date_joined

    '''

    nome = models.CharField(blank=True, null=True, max_length=100)
    CPF = models.CharField(blank=True, null=True, max_length=15)

    foto_de_perfil = models.ImageField(upload_to='fotos_de_perfil/', blank=True, null=True)

    genero_choices = (
        ("F", "Feminino"),
        ("M", "Masculino"),
        ("NB", "Não-binário"),
        ("PND", "Prefiro não dizer"),
        ("OU", "Outro")
    )

    telefone = models.CharField(max_length=15, blank=True, null=True)
    genero = models.CharField(max_length=20, choices=genero_choices, default="F", null=True, blank=True, verbose_name="Identidade de gênero")
    outro_genero = models.CharField(max_length=50, blank=True, null=True, verbose_name="Outro gênero")
    dt_nasc = models.DateField(blank=True, null=True, verbose_name="Data de Nascimento")
    enderecos = models.ManyToManyField(Endereco, related_name="enderecos_do_cliente", blank=True)

    def __str__(self):
        return self.username
    
    def perfil_preview(self):
        if self.foto_de_perfil:
            return mark_safe(f'<img src="{self.foto_de_perfil.url}" width="100">')
        else:
            foto_padrao_url = settings.STATIC_URL + 'images/usuario.png'
            return mark_safe(f'<img src="{foto_padrao_url}" width="100">')