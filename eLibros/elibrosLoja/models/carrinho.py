from django.db import models

class Carrinho(models.Model):
    session_id = models.CharField(max_length=100, null=True, blank=True)
    cliente = models.ForeignKey('accounts.Cliente', null=True, related_name="cliente_do_carrinho", on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, blank=True)

    def __str__(self):
        return f"Carrinho de {self.cliente.username if self.cliente else 'Anônimo'}"
    
    @property
    def preco_carrinho(self):
        return sum(item.preco * item.quantidade for item in self.items_do_carrinho.all())

    @property
    def numero_itens(self):
        return sum(item.quantidade for item in self.items_do_carrinho.all())
        
