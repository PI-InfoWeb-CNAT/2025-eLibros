from django.db import models

class Desconto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    valor = models.DecimalField(max_digits=3, decimal_places=2) # 0.75, 0.50, 0.25 ...
    ativo = models.BooleanField(default=True)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    
    def __str__(self):
        return self.codigo