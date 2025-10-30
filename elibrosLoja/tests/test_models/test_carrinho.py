from django.test import TestCase
from django.utils import timezone
from elibrosLoja.models import Carrinho, ItemCarrinho, Livro, Cliente
from accounts.models import Usuario


class CarrinhoTestCase(TestCase):
	@classmethod
	def setUpTestData(cls):
		cls.usuario = Usuario.objects.create(
			email="u2@t.com",
			username="u2",
			password="p",
			nome="U2",
			CPF="00000000001",
			telefone="11900000001",
			genero="M",
			dt_nasc="1990-01-01"
		)
		cls.cliente = Cliente.objects.create(user=cls.usuario)
		cls.livro = Livro.objects.create(titulo="Livro C", ISBN="ISBN-C", preco=5.00, quantidade=100)

	def setUp(self):
		self.carrinho = Carrinho.objects.create(cliente=self.cliente)

	def test_preco_e_numero_itens(self):
		item1 = ItemCarrinho.objects.create(livro=self.livro, quantidade=3, carrinho=self.carrinho)
		item2 = ItemCarrinho.objects.create(livro=self.livro, quantidade=8, carrinho=self.carrinho)
		# atualizar caroço de propriedades
		self.assertEqual(self.carrinho.numero_itens, 11)
		self.assertAlmostEqual(float(self.carrinho.preco_carrinho), float(item1.preco * 3 + item2.preco * 8))
		self.assertTrue(self.carrinho.maior_que_10())

