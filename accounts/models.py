from django.contrib.auth.models import AbstractUser
from django.db import models


from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from .managers import CustomUserManager

from rest_framework_simplejwt.tokens import RefreshToken


class Usuario(AbstractUser):

    nome = models.CharField(blank=False, null=False, max_length=100, default="Nome não informado")
    CPF = models.CharField(blank=False, null=False, max_length=14, default="000.000.000-00")
    email = models.EmailField(_("email address"), unique=True)

    email_is_verified = models.BooleanField(default=False)
    
    # Campo para tokens de redefinição de senha (opcional)
    login_token = models.CharField(max_length=10, blank=True, null=True)

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
    genero = models.CharField(max_length=20, choices=genero_choices, default="NI", null=True, blank=False, verbose_name="Identidade de gênero")
    dt_nasc = models.DateField(blank=False, null=True, verbose_name="Data de Nascimento", default="2000-01-01")

    def __str__(self):
        return self.email
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    def perfil_preview(self):
        if self.foto_de_perfil:
            return mark_safe(f'<img src="{self.foto_de_perfil.url}" width="100">')
        else:
            foto_padrao_url = settings.STATIC_URL + 'images/usuario.png'
            return mark_safe(f'<img src="{foto_padrao_url}" width="100">')