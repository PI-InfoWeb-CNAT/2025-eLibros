from django.test import TestCase
from elibrosLoja.models import Endereco


class EnderecoTestCase(TestCase):
	def setUp(self):
		self.endereco = Endereco.objects.create(
			cep="01234-567",
			uf="SP",
			cidade="São Paulo",
			bairro="Centro",
			rua="Rua Teste",
			numero=123,
			complemento="Apto 1"
		)

	def test_endereco_created(self):
		self.assertIsNotNone(self.endereco.pk)
		self.assertIn("Rua Teste", str(self.endereco))

