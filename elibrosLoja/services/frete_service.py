"""
Serviço de cálculo de frete para a eLibros.

Este serviço calcula o frete baseado em:
- CEP de destino (região do Brasil)
- Quantidade de livros
- Peso estimado dos livros
"""

from dataclasses import dataclass
from decimal import Decimal
from typing import List, Optional
import re


@dataclass
class OpcaoFrete:
    """Representa uma opção de frete disponível."""
    tipo: str
    nome: str
    preco: Decimal
    prazo_dias_min: int
    prazo_dias_max: int
    descricao: str


@dataclass
class ResultadoFrete:
    """Resultado do cálculo de frete."""
    cep_destino: str
    cep_valido: bool
    regiao: str
    peso_total_kg: Decimal
    quantidade_itens: int
    opcoes: List[OpcaoFrete]
    mensagem: Optional[str] = None


class FreteService:
    """
    Serviço responsável pelo cálculo de frete.
    
    Utiliza uma simulação baseada em regiões do Brasil,
    calculando o frete com base no CEP de destino e quantidade de livros.
    """
    
    # Peso médio de um livro em kg
    PESO_MEDIO_LIVRO = Decimal('0.4')
    
    # Taxa base por região (em R$)
    TAXAS_REGIAO = {
        'sudeste': Decimal('8.00'),
        'sul': Decimal('10.00'),
        'centro-oeste': Decimal('12.00'),
        'nordeste': Decimal('15.00'),
        'norte': Decimal('18.00'),
    }
    
    # Multiplicador de preço por tipo de frete
    MULTIPLICADORES_FRETE = {
        'economico': Decimal('1.0'),
        'padrao': Decimal('1.5'),
        'expresso': Decimal('2.5'),
    }
    
    # Prazos base por região (em dias úteis) - (min, max)
    PRAZOS_REGIAO = {
        'sudeste': (2, 5),
        'sul': (3, 7),
        'centro-oeste': (4, 8),
        'nordeste': (5, 10),
        'norte': (7, 15),
    }
    
    # Faixas de CEP por região
    FAIXAS_CEP = {
        'sudeste': [
            (1000000, 19999999),   # SP
            (20000000, 28999999),  # RJ
            (29000000, 29999999),  # ES
            (30000000, 39999999),  # MG
        ],
        'sul': [
            (80000000, 87999999),  # PR
            (88000000, 89999999),  # SC
            (90000000, 99999999),  # RS
        ],
        'centro-oeste': [
            (70000000, 73699999),  # DF
            (73700000, 76799999),  # GO
            (78000000, 78899999),  # MT
            (79000000, 79999999),  # MS
        ],
        'nordeste': [
            (40000000, 48999999),  # BA
            (49000000, 49999999),  # SE
            (50000000, 56999999),  # PE
            (57000000, 57999999),  # AL
            (58000000, 58999999),  # PB
            (59000000, 59999999),  # RN
            (60000000, 63999999),  # CE
            (64000000, 64999999),  # PI
            (65000000, 65999999),  # MA
        ],
        'norte': [
            (66000000, 68899999),  # PA
            (68900000, 68999999),  # AP
            (69000000, 69299999),  # AM
            (69300000, 69399999),  # RR
            (69400000, 69899999),  # AM
            (69900000, 69999999),  # AC
            (76800000, 76999999),  # RO
            (77000000, 77999999),  # TO
        ],
    }

    @classmethod
    def validar_cep(cls, cep: str) -> tuple[bool, str]:
        """
        Valida o formato do CEP.
        
        Args:
            cep: CEP a ser validado (pode conter hífen)
            
        Returns:
            Tupla (é_válido, cep_limpo)
        """
        # Remove caracteres não numéricos
        cep_limpo = re.sub(r'\D', '', cep)
        
        # Verifica se tem 8 dígitos
        if len(cep_limpo) != 8:
            return False, cep_limpo
            
        # Verifica se é um CEP válido (não pode ser 00000000)
        if cep_limpo == '00000000':
            return False, cep_limpo
            
        return True, cep_limpo

    @classmethod
    def identificar_regiao(cls, cep: str) -> Optional[str]:
        """
        Identifica a região do Brasil baseado no CEP.
        
        Args:
            cep: CEP limpo (apenas números)
            
        Returns:
            Nome da região ou None se não encontrada
        """
        try:
            cep_num = int(cep)
        except ValueError:
            return None
            
        for regiao, faixas in cls.FAIXAS_CEP.items():
            for inicio, fim in faixas:
                if inicio <= cep_num <= fim:
                    return regiao
                    
        return None

    @classmethod
    def calcular_peso(cls, quantidade: int) -> Decimal:
        """
        Calcula o peso total baseado na quantidade de livros.
        
        Args:
            quantidade: Número de livros
            
        Returns:
            Peso total em kg
        """
        return cls.PESO_MEDIO_LIVRO * Decimal(quantidade)

    @classmethod
    def _calcular_preco_frete(
        cls, 
        taxa_base: Decimal, 
        peso_kg: Decimal, 
        multiplicador: Decimal
    ) -> Decimal:
        """
        Calcula o preço do frete.
        
        Fórmula: (taxa_base + (peso_kg * 2)) * multiplicador
        """
        preco = (taxa_base + (peso_kg * Decimal('2.0'))) * multiplicador
        # Arredonda para 2 casas decimais
        return preco.quantize(Decimal('0.01'))

    @classmethod
    def _ajustar_prazo(cls, prazo_base: tuple, tipo_frete: str) -> tuple:
        """
        Ajusta o prazo baseado no tipo de frete.
        """
        min_dias, max_dias = prazo_base
        
        if tipo_frete == 'economico':
            # Econômico adiciona dias
            return (min_dias + 3, max_dias + 5)
        elif tipo_frete == 'expresso':
            # Expresso reduz dias (mínimo 1)
            return (max(1, min_dias - 1), max(2, max_dias - 2))
        else:
            # Padrão mantém
            return prazo_base

    @classmethod
    def calcular_frete_livro(
        cls, 
        cep_destino: str, 
        quantidade: int = 1
    ) -> ResultadoFrete:
        """
        Calcula o frete para um ou mais livros iguais.
        
        Args:
            cep_destino: CEP de destino
            quantidade: Quantidade de exemplares do mesmo livro
            
        Returns:
            ResultadoFrete com as opções disponíveis
        """
        # Valida CEP
        cep_valido, cep_limpo = cls.validar_cep(cep_destino)
        
        if not cep_valido:
            return ResultadoFrete(
                cep_destino=cep_destino,
                cep_valido=False,
                regiao='',
                peso_total_kg=Decimal('0'),
                quantidade_itens=quantidade,
                opcoes=[],
                mensagem='CEP inválido. Informe um CEP com 8 dígitos.'
            )
        
        # Identifica região
        regiao = cls.identificar_regiao(cep_limpo)
        
        if not regiao:
            return ResultadoFrete(
                cep_destino=cep_limpo,
                cep_valido=True,
                regiao='desconhecida',
                peso_total_kg=Decimal('0'),
                quantidade_itens=quantidade,
                opcoes=[],
                mensagem='CEP não encontrado em nenhuma região conhecida.'
            )
        
        # Calcula peso
        peso_total = cls.calcular_peso(quantidade)
        
        # Taxa base da região
        taxa_base = cls.TAXAS_REGIAO[regiao]
        prazo_base = cls.PRAZOS_REGIAO[regiao]
        
        # Gera opções de frete
        opcoes = []
        
        # Frete Econômico
        preco_economico = cls._calcular_preco_frete(
            taxa_base, peso_total, cls.MULTIPLICADORES_FRETE['economico']
        )
        prazo_economico = cls._ajustar_prazo(prazo_base, 'economico')
        opcoes.append(OpcaoFrete(
            tipo='economico',
            nome='Econômico',
            preco=preco_economico,
            prazo_dias_min=prazo_economico[0],
            prazo_dias_max=prazo_economico[1],
            descricao='Entrega econômica com prazo estendido'
        ))
        
        # Frete Padrão
        preco_padrao = cls._calcular_preco_frete(
            taxa_base, peso_total, cls.MULTIPLICADORES_FRETE['padrao']
        )
        prazo_padrao = cls._ajustar_prazo(prazo_base, 'padrao')
        opcoes.append(OpcaoFrete(
            tipo='padrao',
            nome='Padrão',
            preco=preco_padrao,
            prazo_dias_min=prazo_padrao[0],
            prazo_dias_max=prazo_padrao[1],
            descricao='Entrega padrão'
        ))
        
        # Frete Expresso
        preco_expresso = cls._calcular_preco_frete(
            taxa_base, peso_total, cls.MULTIPLICADORES_FRETE['expresso']
        )
        prazo_expresso = cls._ajustar_prazo(prazo_base, 'expresso')
        opcoes.append(OpcaoFrete(
            tipo='expresso',
            nome='Expresso',
            preco=preco_expresso,
            prazo_dias_min=prazo_expresso[0],
            prazo_dias_max=prazo_expresso[1],
            descricao='Entrega rápida prioritária'
        ))
        
        return ResultadoFrete(
            cep_destino=cep_limpo,
            cep_valido=True,
            regiao=regiao,
            peso_total_kg=peso_total,
            quantidade_itens=quantidade,
            opcoes=opcoes
        )

    @classmethod
    def calcular_frete_carrinho(
        cls,
        cep_destino: str,
        itens_carrinho: list
    ) -> ResultadoFrete:
        """
        Calcula o frete para todos os itens de um carrinho.
        
        Args:
            cep_destino: CEP de destino
            itens_carrinho: Lista de itens do carrinho (ItemCarrinho)
            
        Returns:
            ResultadoFrete com as opções disponíveis
        """
        # Calcula quantidade total de livros no carrinho
        quantidade_total = sum(item.quantidade for item in itens_carrinho)
        
        if quantidade_total == 0:
            return ResultadoFrete(
                cep_destino=cep_destino,
                cep_valido=True,
                regiao='',
                peso_total_kg=Decimal('0'),
                quantidade_itens=0,
                opcoes=[],
                mensagem='Carrinho vazio. Adicione livros para calcular o frete.'
            )
        
        # Usa o método de livro com a quantidade total
        return cls.calcular_frete_livro(cep_destino, quantidade_total)

    @classmethod
    def verificar_frete_gratis(
        cls, 
        valor_pedido: Decimal, 
        valor_minimo: Decimal = Decimal('150.00')
    ) -> bool:
        """
        Verifica se o pedido tem direito a frete grátis.
        
        Args:
            valor_pedido: Valor total do pedido
            valor_minimo: Valor mínimo para frete grátis
            
        Returns:
            True se tem direito a frete grátis
        """
        return valor_pedido >= valor_minimo

    @classmethod
    def aplicar_frete_gratis(
        cls,
        resultado_frete: ResultadoFrete,
        valor_pedido: Decimal,
        valor_minimo: Decimal = Decimal('150.00')
    ) -> ResultadoFrete:
        """
        Aplica frete grátis se o pedido atingir o valor mínimo.
        
        O frete grátis é aplicado apenas na opção "Padrão".
        """
        if not cls.verificar_frete_gratis(valor_pedido, valor_minimo):
            return resultado_frete
        
        novas_opcoes = []
        for opcao in resultado_frete.opcoes:
            if opcao.tipo == 'padrao':
                novas_opcoes.append(OpcaoFrete(
                    tipo=opcao.tipo,
                    nome=f'{opcao.nome} (GRÁTIS)',
                    preco=Decimal('0.00'),
                    prazo_dias_min=opcao.prazo_dias_min,
                    prazo_dias_max=opcao.prazo_dias_max,
                    descricao=f'{opcao.descricao} - Frete grátis para compras acima de R$ {valor_minimo}'
                ))
            else:
                novas_opcoes.append(opcao)
        
        resultado_frete.opcoes = novas_opcoes
        resultado_frete.mensagem = f'Parabéns! Você ganhou frete grátis na opção Padrão (compras acima de R$ {valor_minimo}).'
        
        return resultado_frete
