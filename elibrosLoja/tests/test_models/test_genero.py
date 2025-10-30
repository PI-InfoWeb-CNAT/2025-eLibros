from django.test import TestCase
from elibrosLoja.models import Genero


class GeneroTestCase(TestCase):
	def setUp(self):
		self.genero = Genero.objects.create(nome="Gênero Teste")

	def test_genero_created(self):
		self.assertIsNotNone(self.genero.pk)
		self.assertEqual(str(self.genero), "Gênero Teste")

