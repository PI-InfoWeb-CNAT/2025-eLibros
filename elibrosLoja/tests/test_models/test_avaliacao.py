from django.test import TestCase
from elibrosLoja.models import Avaliacao, Livro, Autor, Genero, Categoria
from accounts.models import Usuario

class AvaliacaoTestCase(TestCase):

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
        cls.autor = Autor.objects.create(
            nome="Autor Teste"
        )
        cls.genero = Genero.objects.create(
            nome="Gênero Teste"
        )
        cls.categoria = Categoria.objects.create(
            nome="Categoria Teste"
        )
        cls.livro = Livro.objects.create(
            titulo="Livro Teste",
            subtitulo="Subtítulo do Livro Teste",
            autor=cls.autor,
            editora="Editora Teste",
            ISBN="123-4567890123",
            data_de_publicacao="2020-01-01",
            ano_de_publicacao=2020,
            capa_url="https://m.media-amazon.com/images/I/61TaHURu27L._SL1000_.jpg",
            sinopse="Sinopse do livro teste.",
            genero=cls.genero,
            categoria=cls.categoria,
            preco=29.90,
            quantidade=10
        )


    def setUp(self):
        self.avaliacao = Avaliacao.objects.create(
            usuario=self.usuario,
            livro=self.livro,
            texto="Ótimo livro, recomendo!"
        )