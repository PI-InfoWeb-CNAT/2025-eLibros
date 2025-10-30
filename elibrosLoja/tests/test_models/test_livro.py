from django.test import TestCase
from elibrosLoja.models import Livro


class LivroTestCase(TestCase):
	def setUp(self):
		self.livro = Livro.objects.create(
			titulo="Livro Teste",
			ISBN="ISBN-LIV-1",
			preco=20.00,
			quantidade=10
		)

	def test_livro_created_and_str(self):
		self.assertIsNotNone(self.livro.pk)
		self.assertIn("Livro Teste", str(self.livro))

