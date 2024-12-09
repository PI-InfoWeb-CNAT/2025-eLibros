from django.contrib.auth.models import AbstractUser
from django.db import models

from django.utils.html import mark_safe
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

# login poderá ser feito com email ou username, e senha


class Usuario(AbstractUser):

    nome = models.CharField(blank=False, null=False, max_length=100, default="Nome não informado")
    CPF = models.CharField(blank=False, null=False, max_length=14, default="000.000.000-00")
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    foto_de_perfil = models.ImageField(upload_to='fotos_de_perfil/', blank=True, null=True)
    


    genero_choices = (
        ("F", "Feminino"),
        ("M", "Masculino"),
        ("NB", "Não-binário"),
        ("PND", "Prefiro não dizer"),
        ("NI", "Não informado"),
    )

    telefone = models.CharField(max_length=15, blank=False, null=False, default="(00) 00000-0000")
    genero = models.CharField(max_length=20, choices=genero_choices, default="NI", null=False, blank=False, verbose_name="Identidade de gênero")
    dt_nasc = models.DateField(blank=False, null=False, verbose_name="Data de Nascimento", default="2000-01-01")

    def __str__(self):
        return self.email
    
    def perfil_preview(self):
        if self.foto_de_perfil:
            return mark_safe(f'<img src="{self.foto_de_perfil.url}" width="100">')
        else:
            foto_padrao_url = settings.STATIC_URL + 'images/usuario.png'
            return mark_safe(f'<img src="{foto_padrao_url}" width="100">')