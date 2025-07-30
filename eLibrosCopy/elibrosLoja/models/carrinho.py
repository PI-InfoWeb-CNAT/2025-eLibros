from django.db import models
from elibrosLoja.models.cliente import Cliente
from elibrosLoja.models.administrador import Administrador
from simple_history.models import HistoricalRecords

class Carrinho(models.Model):
    session_id = models.CharField(max_length=100, null=True, blank=True)
    cliente = models.ForeignKey(Cliente, null=True, related_name="cliente_do_carrinho", on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, blank=True)

    criado_por = models.ForeignKey(Administrador, on_delete=models.SET_NULL, related_name='carrinhos_criados', null=True, blank=True)
    historico = HistoricalRecords(user_model=Administrador)

    def __str__(self):
        return f"Carrinho de {self.cliente.user.username if self.cliente else 'Anônimo'}"
    
    @property
    def preco_carrinho(self):
        return sum(item.preco * item.quantidade for item in self.items_do_carrinho.all())

    @property
    def numero_itens(self):
        return sum(item.quantidade for item in self.items_do_carrinho.all())

    def maior_que_10(self):
        if self.numero_itens >= 10:
            return True
        else: return False
    
    @property
    def _history_user(self):
        return self.criado_por
    
    @_history_user.setter
    def _history_user(self, value):
        self.criado_por = value
        
