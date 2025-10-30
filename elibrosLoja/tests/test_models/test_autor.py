from django.test import TestCase
from elibrosLoja.models import Autor


class AutorTestCase(TestCase):
	def setUp(self):
		self.autor = Autor.objects.create(nome="Autor Teste")

	def test_autor_created(self):
		self.assertIsNotNone(self.autor.pk)
		self.assertEqual(str(self.autor), "Autor Teste")

