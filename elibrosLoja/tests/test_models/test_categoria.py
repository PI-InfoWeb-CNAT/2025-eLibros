
from django.test import TestCase
from elibrosLoja.models import Categoria


class CategoriaTestCase(TestCase):
	def setUp(self):
		self.cat = Categoria.objects.create(nome="Categoria Teste")

	def test_categoria_created(self):
		self.assertIsNotNone(self.cat.pk)
		self.assertEqual(str(self.cat), "Categoria Teste")

