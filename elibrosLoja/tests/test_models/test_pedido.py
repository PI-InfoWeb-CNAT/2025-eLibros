from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from elibrosLoja.models import Pedido, ItemCarrinho, Livro, Endereco, Cliente
from accounts.models import Usuario


class PedidoTestCase(TestCase):
	@classmethod
	def setUpTestData(cls):
		cls.user = Usuario.objects.create(
			email="ped@t.com",
			username="ped",
			password="p",
			nome="Ped",
			CPF="22233344455",
			telefone="11911112222",
			genero="M",
			dt_nasc="1990-01-01"
		)
		cls.endereco = Endereco.objects.create(
			cep="00000-000",
			uf="SP",
			cidade="Cidade",
			bairro="Bairro",
			rua="Rua P",
			numero=1
		)
		cls.cliente = Cliente.objects.create(user=cls.user, endereco=cls.endereco)
		cls.livro = Livro.objects.create(titulo="Livro P", ISBN="ISBN-P-1", preco=9.99, quantidade=5)

	def test_pedido_workflow(self):
		item = ItemCarrinho.objects.create(livro=self.livro, quantidade=2, carrinho=None)
		now = timezone.now()
		pedido = Pedido.objects.create(
			cliente=self.cliente,
			endereco=self.endereco,
			data_de_pedido=now,
			entrega_estimada=now + timedelta(days=3),
			valor_total=19.98
		)
		pedido.itens.add(item)
		pedido.quantia_itens = 1
		pedido.save()

		self.assertIn("Pedido Nº", str(pedido))
		# confirmado falso por padrão
		self.assertFalse(pedido.confirmado())
		pedido.status = 'CON'
		pedido.save()
		self.assertTrue(pedido.confirmado())

