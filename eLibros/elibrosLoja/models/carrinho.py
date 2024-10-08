from django.db import models
from elibrosLoja.models.itemcarrinho import ItemCarrinho

class Carrinho(models.Model):
    session_id = models.CharField(max_length=100, null=True, blank=True)
    cliente = models.ForeignKey('accounts.Cliente', null=True, related_name="cliente_do_carrinho", on_delete=models.CASCADE)
    items = models.ManyToManyField(ItemCarrinho, related_name="items_do_carrinho", blank=True)
    total = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, blank=True)

    def __str__(self):
        if self.cliente:
            return f"Carrinho de {self.cliente.username}"
        else:
            return f"Carrinho de {self.session_id}"
    
    @property
    def preco_carrinho(self):
        self.total = sum(item.preco for item in self.items.all())

    @property
    def numero_itens(self):
        itens = self.items.all()
        quantia = sum([item.quantidade for item in itens])
        return quantia

        
