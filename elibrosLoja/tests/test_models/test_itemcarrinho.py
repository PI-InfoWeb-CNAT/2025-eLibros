from django.test import TestCase
from elibrosLoja.models import Livro, Carrinho, ItemCarrinho
from accounts.models import Usuario


class ItemCarrinhoTestCase(TestCase):
	def setUp(self):
		# criar usuário e livro mínimo
		self.usuario = Usuario.objects.create(
			email="u@t.com",
			username="u1",
			password="p",
			nome="U",
			CPF="00000000000",
			telefone="11900000000",
			genero="M",
			dt_nasc="1990-01-01"
		)
		self.livro = Livro.objects.create(
			titulo="Livro Teste",
			ISBN="ISBN-ITEM-1",
			preco=15.00,
			quantidade=5
		)
		self.carrinho = Carrinho.objects.create(cliente=None)

	def test_itemcarrinho_save_sets_preco(self):
		item = ItemCarrinho.objects.create(livro=self.livro, quantidade=2, carrinho=self.carrinho)
		# preco deve ser preenchido automaticamente com livro.preco
		self.assertEqual(float(item.preco), float(self.livro.preco))

