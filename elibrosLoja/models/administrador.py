from django.conf import settings
from django.db import models


class Administrador(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    rg = models.CharField(max_length=9, null=True, blank=True)
    

    def __str__(self):
        return f'{self.user.nome} (Administrador) - {self.user.email}'
    
    class Meta:
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"

   
    