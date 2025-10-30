from django.test import TestCase

from accounts.models import Usuario

class AdministradorTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.usuario = Usuario.objects.create(
            email="usuario@teste.com",
            username="usuario_teste",
            password="usuario123",
            nome="Usuario Teste",
            CPF="12345678901",
            telefone="11999999999",
            genero="M",
            dt_nasc="1990-01-01"
        )

    def setUp(self):
        from elibrosLoja.models.administrador import Administrador
        self.administrador = Administrador.objects.create(
            user=self.usuario,
            rg="123456789"
        )
