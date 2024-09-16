from django.db import models

from elibrosLoja.models.livro import Livro

class ItemCarrinho(models.Model):
    livro = models.ForeignKey(Livro, null=False, related_name="livro_selecionado", on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco = models.DecimalField(max_digits=5, decimal_places=2, blank=True)

    def __str__(self):
        return f"{self.quantidade}x {self.livro.titulo}"
    
    def save(self, *args, **kwargs):
        if not self.preco:
            self.preco = self.livro.preco
        super().save(*args, **kwargs)