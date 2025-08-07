from django.db import models

from elibrosLoja.models.livro import Livro
from elibrosLoja.models.carrinho import Carrinho
from simple_history.models import HistoricalRecords
from elibrosLoja.models.administrador import Administrador
from django.conf import settings

class ItemCarrinho(models.Model):
    livro = models.ForeignKey(Livro, null=False, related_name="livro_selecionado", on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco = models.DecimalField(max_digits=5, decimal_places=2, blank=True)
    carrinho = models.ForeignKey(Carrinho, related_name="items_do_carrinho", on_delete=models.CASCADE, null=True)

    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='Itemcarrinho_criados', null=True, blank=True)
    historico = HistoricalRecords(user_model=Administrador)

    @property
    def _history_user(self):
        return self.criado_por
    
    @_history_user.setter
    def _history_user(self, value):
        if isinstance(value, Administrador):
            self.criado_por = value
        else:
            self.criado_por = Administrador.objects.get(user=value)

    def __str__(self):
        return f"{self.quantidade}x {self.livro.titulo}"
    
    def save(self, *args, **kwargs):
        if not self.preco:
            self.preco = self.livro.preco
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Item de carrinho"
        verbose_name_plural = "Itens de carrinho"