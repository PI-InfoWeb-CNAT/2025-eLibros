"""
Views para cálculo de frete.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from ..services.frete_service import FreteService
from ..serializers import (
    CalcularFreteLivroSerializer,
    CalcularFreteCarrinhoSerializer,
    ResultadoFreteSerializer
)
from ..models import Livro, Carrinho


class CalcularFreteLivroView(APIView):
    """
    View para calcular o frete de um livro específico.
    
    Permite que visitantes e clientes calculem o frete
    informando o CEP de destino e a quantidade desejada.
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        summary="Calcular frete de um livro",
        description="""
        Calcula o frete para um livro específico baseado no CEP de destino.
        
        Retorna as opções de frete disponíveis (Econômico, Padrão e Expresso)
        com preços e prazos estimados.
        
        O cálculo considera:
        - Região do Brasil (baseado no CEP)
        - Quantidade de exemplares
        - Peso estimado dos livros
        """,
        parameters=[
            OpenApiParameter(
                name='livro_id',
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description='ID do livro'
            ),
        ],
        request=CalcularFreteLivroSerializer,
        responses={
            200: ResultadoFreteSerializer,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Exemplo de requisição',
                value={
                    'cep': '01310-100',
                    'quantidade': 2
                },
                request_only=True,
            ),
            OpenApiExample(
                'Exemplo de resposta',
                value={
                    'cep_destino': '01310100',
                    'cep_valido': True,
                    'regiao': 'sudeste',
                    'peso_total_kg': '0.80',
                    'quantidade_itens': 2,
                    'opcoes': [
                        {
                            'tipo': 'economico',
                            'nome': 'Econômico',
                            'preco': '9.60',
                            'prazo_dias_min': 5,
                            'prazo_dias_max': 10,
                            'descricao': 'Entrega econômica com prazo estendido'
                        },
                        {
                            'tipo': 'padrao',
                            'nome': 'Padrão',
                            'preco': '14.40',
                            'prazo_dias_min': 2,
                            'prazo_dias_max': 5,
                            'descricao': 'Entrega padrão'
                        },
                        {
                            'tipo': 'expresso',
                            'nome': 'Expresso',
                            'preco': '24.00',
                            'prazo_dias_min': 1,
                            'prazo_dias_max': 3,
                            'descricao': 'Entrega rápida prioritária'
                        }
                    ],
                    'mensagem': None
                },
                response_only=True,
            ),
        ],
        tags=['Frete']
    )
    def post(self, request: Request, livro_id: int) -> Response:
        """Calcula o frete para um livro específico."""
        # Verifica se o livro existe
        try:
            livro = Livro.objects.get(pk=livro_id)
        except Livro.DoesNotExist:
            return Response(
                {'detail': 'Livro não encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Valida os dados de entrada
        serializer = CalcularFreteLivroSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cep = serializer.validated_data['cep']
        quantidade = serializer.validated_data.get('quantidade', 1)
        
        # Calcula o frete
        resultado = FreteService.calcular_frete_livro(cep, quantidade)
        
        # Serializa e retorna o resultado
        resultado_serializer = ResultadoFreteSerializer(resultado)
        return Response(resultado_serializer.data)


class CalcularFreteCarrinhoView(APIView):
    """
    View para calcular o frete do carrinho do cliente.
    
    O cliente autenticado pode calcular o frete de todo o seu carrinho
    informando o CEP de destino.
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        summary="Calcular frete do carrinho",
        description="""
        Calcula o frete para todos os itens do carrinho do cliente autenticado.
        
        Retorna as opções de frete disponíveis (Econômico, Padrão e Expresso)
        com preços e prazos estimados.
        
        Se o valor total do carrinho for maior ou igual a R$ 150,00,
        o frete Padrão será gratuito.
        
        O cálculo considera:
        - Região do Brasil (baseado no CEP)
        - Quantidade total de livros no carrinho
        - Peso estimado total
        - Valor total do carrinho (para frete grátis)
        """,
        request=CalcularFreteCarrinhoSerializer,
        responses={
            200: ResultadoFreteSerializer,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Exemplo de requisição',
                value={
                    'cep': '01310-100'
                },
                request_only=True,
            ),
        ],
        tags=['Frete']
    )
    def post(self, request: Request) -> Response:
        """Calcula o frete para o carrinho do cliente autenticado."""
        # Valida os dados de entrada
        serializer = CalcularFreteCarrinhoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cep = serializer.validated_data['cep']
        
        # Busca o carrinho do cliente
        try:
            from ..models import Cliente
            cliente = Cliente.objects.get(user=request.user)
            carrinho = Carrinho.objects.filter(cliente=cliente).first()
        except Cliente.DoesNotExist:
            return Response(
                {'detail': 'Cliente não encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not carrinho:
            return Response(
                {'detail': 'Carrinho não encontrado. Adicione itens ao carrinho primeiro.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Pega os itens do carrinho
        itens = carrinho.items_do_carrinho.all()
        
        if not itens.exists():
            return Response(
                {
                    'cep_destino': cep,
                    'cep_valido': True,
                    'regiao': '',
                    'peso_total_kg': '0.00',
                    'quantidade_itens': 0,
                    'opcoes': [],
                    'mensagem': 'Carrinho vazio. Adicione livros para calcular o frete.'
                }
            )
        
        # Calcula o frete
        resultado = FreteService.calcular_frete_carrinho(cep, list(itens))
        
        # Verifica se tem direito a frete grátis
        valor_carrinho = carrinho.preco_carrinho
        resultado = FreteService.aplicar_frete_gratis(resultado, valor_carrinho)
        
        # Serializa e retorna o resultado
        resultado_serializer = ResultadoFreteSerializer(resultado)
        return Response(resultado_serializer.data)


class CalcularFreteCepView(APIView):
    """
    View para calcular o frete genérico apenas com CEP e quantidade.
    
    Útil para visitantes que querem ter uma estimativa de frete
    sem especificar um livro ou ter um carrinho.
    """
    permission_classes = [AllowAny]
    
    @extend_schema(
        summary="Calcular frete por CEP",
        description="""
        Calcula uma estimativa de frete baseada apenas no CEP e quantidade de livros.
        
        Útil para visitantes que desejam ter uma ideia dos custos de entrega
        antes de adicionar livros ao carrinho.
        """,
        request=CalcularFreteLivroSerializer,
        responses={
            200: ResultadoFreteSerializer,
            400: OpenApiTypes.OBJECT,
        },
        examples=[
            OpenApiExample(
                'Exemplo de requisição',
                value={
                    'cep': '60000-000',
                    'quantidade': 3
                },
                request_only=True,
            ),
        ],
        tags=['Frete']
    )
    def post(self, request: Request) -> Response:
        """Calcula uma estimativa de frete por CEP."""
        serializer = CalcularFreteLivroSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cep = serializer.validated_data['cep']
        quantidade = serializer.validated_data.get('quantidade', 1)
        
        resultado = FreteService.calcular_frete_livro(cep, quantidade)
        resultado_serializer = ResultadoFreteSerializer(resultado)
        
        return Response(resultado_serializer.data)
