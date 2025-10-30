from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from elibrosLoja.models import Cupom


class CupomTestCase(TestCase):
	def setUp(self):
		now = timezone.now()
		self.cupom = Cupom.objects.create(
			codigo="CUPOM10",
			valor=10,
			tipo_valor="1",
			data_inicio=now - timedelta(days=1),
			data_fim=now + timedelta(days=1)
		)

	def test_cupom_created_and_valid(self):
		self.assertIsNotNone(self.cupom.pk)
		self.assertTrue(self.cupom.get_validade)
		self.assertIn("CUPOM10", str(self.cupom))

