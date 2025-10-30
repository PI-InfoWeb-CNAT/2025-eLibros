from django.test import TestCase
from accounts.models import Usuario
from elibrosLoja.models import Cliente, Endereco
from django.utils import timezone


class ClienteTestCase(TestCase):
	@classmethod
	def setUpTestData(cls):
		cls.usuario = Usuario.objects.create(
			email="cliente@teste.com",
			username="cliente_teste",
			password="cliente123",
			nome="Cliente Teste",
			CPF="11122233344",
			telefone="11988887777",
			genero="M",
			dt_nasc="1990-01-01"
		)
		cls.endereco = Endereco.objects.create(
			cep="01234-567",
			uf="SP",
			cidade="São Paulo",
			bairro="Centro",
			rua="Rua Cliente",
			numero=10
		)

	def setUp(self):
		self.cliente = Cliente.objects.create(user=self.usuario, endereco=self.endereco)

	def test_cliente_created(self):
		self.assertIsNotNone(self.cliente.pk)
		self.assertIn(self.usuario.email, str(self.cliente))

