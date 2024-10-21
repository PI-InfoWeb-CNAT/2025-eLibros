from django.db import models
from datetime import timezone
class Cupom(models.Model):
    codigo = models.CharField(max_length=15)
    valor_desconto = models.IntegerField()
    tipo_desconto = models.CharField(max_length=1) # P para percentual e V para valor
    ativo = models.BooleanField(default=True)
    data_validade = models.DateTimeField()

    def __str__(self):
        return self.codigo

    @property
    def checar_ativo(self):
        if self.data_validade < timezone.now() or not self.ativo:
            self.ativo = False
        return self.ativo