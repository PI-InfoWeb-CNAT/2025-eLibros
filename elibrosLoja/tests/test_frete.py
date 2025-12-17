"""
Testes para a API de Frete.
"""

from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from elibrosLoja.services.frete_service import FreteService, ResultadoFrete, OpcaoFrete
from elibrosLoja.models import Livro, Carrinho, ItemCarrinho, Cliente, Autor
from accounts.models import Usuario


class FreteServiceTestCase(TestCase):
    """Testes unitários para o FreteService."""
    
    def test_validar_cep_valido(self):
        """Testa validação de CEP válido."""
        valido, cep_limpo = FreteService.validar_cep('01310-100')
        self.assertTrue(valido)
        self.assertEqual(cep_limpo, '01310100')
    
    def test_validar_cep_valido_sem_hifen(self):
        """Testa validação de CEP válido sem hífen."""
        valido, cep_limpo = FreteService.validar_cep('01310100')
        self.assertTrue(valido)
        self.assertEqual(cep_limpo, '01310100')
    
    def test_validar_cep_invalido_curto(self):
        """Testa validação de CEP curto."""
        valido, cep_limpo = FreteService.validar_cep('1234567')
        self.assertFalse(valido)
    
    def test_validar_cep_invalido_zeros(self):
        """Testa validação de CEP com zeros."""
        valido, cep_limpo = FreteService.validar_cep('00000000')
        self.assertFalse(valido)
    
    def test_identificar_regiao_sudeste(self):
        """Testa identificação da região Sudeste."""
        # São Paulo
        regiao = FreteService.identificar_regiao('01310100')
        self.assertEqual(regiao, 'sudeste')
        
        # Rio de Janeiro
        regiao = FreteService.identificar_regiao('20040020')
        self.assertEqual(regiao, 'sudeste')
        
        # Minas Gerais
        regiao = FreteService.identificar_regiao('30130000')
        self.assertEqual(regiao, 'sudeste')
    
    def test_identificar_regiao_sul(self):
        """Testa identificação da região Sul."""
        # Paraná
        regiao = FreteService.identificar_regiao('80010000')
        self.assertEqual(regiao, 'sul')
        
        # Rio Grande do Sul
        regiao = FreteService.identificar_regiao('90010000')
        self.assertEqual(regiao, 'sul')
    
    def test_identificar_regiao_nordeste(self):
        """Testa identificação da região Nordeste."""
        # Ceará
        regiao = FreteService.identificar_regiao('60000000')
        self.assertEqual(regiao, 'nordeste')
        
        # Bahia
        regiao = FreteService.identificar_regiao('40000000')
        self.assertEqual(regiao, 'nordeste')
    
    def test_identificar_regiao_centro_oeste(self):
        """Testa identificação da região Centro-Oeste."""
        # Brasília
        regiao = FreteService.identificar_regiao('70000000')
        self.assertEqual(regiao, 'centro-oeste')
    
    def test_identificar_regiao_norte(self):
        """Testa identificação da região Norte."""
        # Pará
        regiao = FreteService.identificar_regiao('66000000')
        self.assertEqual(regiao, 'norte')
        
        # Amazonas
        regiao = FreteService.identificar_regiao('69000000')
        self.assertEqual(regiao, 'norte')
    
    def test_calcular_peso(self):
        """Testa cálculo do peso."""
        peso = FreteService.calcular_peso(1)
        self.assertEqual(peso, Decimal('0.4'))
        
        peso = FreteService.calcular_peso(5)
        self.assertEqual(peso, Decimal('2.0'))
    
    def test_calcular_frete_livro_sudeste(self):
        """Testa cálculo de frete para Sudeste."""
        resultado = FreteService.calcular_frete_livro('01310100', 1)
        
        self.assertTrue(resultado.cep_valido)
        self.assertEqual(resultado.regiao, 'sudeste')
        self.assertEqual(resultado.quantidade_itens, 1)
        self.assertEqual(len(resultado.opcoes), 3)
        
        # Verifica tipos de frete
        tipos = [o.tipo for o in resultado.opcoes]
        self.assertIn('economico', tipos)
        self.assertIn('padrao', tipos)
        self.assertIn('expresso', tipos)
    
    def test_calcular_frete_livro_nordeste(self):
        """Testa cálculo de frete para Nordeste (mais caro)."""
        resultado_sudeste = FreteService.calcular_frete_livro('01310100', 1)
        resultado_nordeste = FreteService.calcular_frete_livro('60000000', 1)
        
        # Frete para Nordeste deve ser mais caro
        preco_sudeste = [o.preco for o in resultado_sudeste.opcoes if o.tipo == 'padrao'][0]
        preco_nordeste = [o.preco for o in resultado_nordeste.opcoes if o.tipo == 'padrao'][0]
        
        self.assertGreater(preco_nordeste, preco_sudeste)
    
    def test_calcular_frete_cep_invalido(self):
        """Testa cálculo com CEP inválido."""
        resultado = FreteService.calcular_frete_livro('123', 1)
        
        self.assertFalse(resultado.cep_valido)
        self.assertEqual(len(resultado.opcoes), 0)
        self.assertIsNotNone(resultado.mensagem)
    
    def test_frete_gratis(self):
        """Testa aplicação de frete grátis."""
        resultado = FreteService.calcular_frete_livro('01310100', 1)
        
        # Sem frete grátis
        resultado_sem = FreteService.aplicar_frete_gratis(resultado, Decimal('100.00'))
        opcao_padrao = [o for o in resultado_sem.opcoes if o.tipo == 'padrao'][0]
        self.assertGreater(opcao_padrao.preco, Decimal('0'))
        
        # Com frete grátis
        resultado = FreteService.calcular_frete_livro('01310100', 1)
        resultado_com = FreteService.aplicar_frete_gratis(resultado, Decimal('200.00'))
        opcao_padrao = [o for o in resultado_com.opcoes if o.tipo == 'padrao'][0]
        self.assertEqual(opcao_padrao.preco, Decimal('0.00'))
        self.assertIn('GRÁTIS', opcao_padrao.nome)


class FreteAPITestCase(APITestCase):
    """Testes de integração para as views de Frete."""
    
    @classmethod
    def setUpTestData(cls):
        """Configura dados de teste."""
        # Criar autor
        cls.autor = Autor.objects.create(nome='Autor Teste')
        
        # Criar livro
        cls.livro = Livro.objects.create(
            titulo='Livro de Teste',
            ISBN='1234567890123',
            preco=Decimal('49.90'),
            quantidade=10,
            ano_de_publicacao=2024
        )
        cls.livro.autor.add(cls.autor)
        
        # Criar usuário e cliente
        cls.usuario = Usuario.objects.create_user(
            email='teste@teste.com',
            username='teste',
            password='senha123',
            nome='Usuário Teste'
        )
        cls.cliente = Cliente.objects.create(user=cls.usuario)
        
        # Criar carrinho com itens
        cls.carrinho = Carrinho.objects.create(cliente=cls.cliente)
        cls.item = ItemCarrinho.objects.create(
            livro=cls.livro,
            quantidade=3,
            preco=cls.livro.preco,
            carrinho=cls.carrinho
        )
    
    def test_calcular_frete_cep_endpoint(self):
        """Testa endpoint de cálculo de frete genérico."""
        url = reverse('frete_calcular')
        data = {'cep': '01310100', 'quantidade': 2}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['cep_valido'])
        self.assertEqual(response.data['regiao'], 'sudeste')
        self.assertEqual(len(response.data['opcoes']), 3)
    
    def test_calcular_frete_livro_endpoint(self):
        """Testa endpoint de cálculo de frete de um livro."""
        url = reverse('frete_livro', kwargs={'livro_id': self.livro.id})
        data = {'cep': '60000-000', 'quantidade': 1}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['cep_valido'])
        self.assertEqual(response.data['regiao'], 'nordeste')
    
    def test_calcular_frete_livro_inexistente(self):
        """Testa cálculo de frete para livro inexistente."""
        url = reverse('frete_livro', kwargs={'livro_id': 99999})
        data = {'cep': '01310100'}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_calcular_frete_carrinho_sem_autenticacao(self):
        """Testa que frete do carrinho requer autenticação."""
        url = reverse('frete_carrinho')
        data = {'cep': '01310100'}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_calcular_frete_carrinho_autenticado(self):
        """Testa cálculo de frete do carrinho para usuário autenticado."""
        self.client.force_authenticate(user=self.usuario)
        
        url = reverse('frete_carrinho')
        data = {'cep': '01310100'}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['cep_valido'])
        self.assertEqual(response.data['quantidade_itens'], 3)  # 3 livros no carrinho
    
    def test_calcular_frete_cep_invalido(self):
        """Testa endpoint com CEP inválido."""
        url = reverse('frete_calcular')
        data = {'cep': '123'}
        
        response = self.client.post(url, data, format='json')
        
        # Deve retornar 400 pois o serializer valida min_length
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
