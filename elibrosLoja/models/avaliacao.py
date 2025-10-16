from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from .livro import Livro


class Avaliacao(models.Model):
    """
    Modelo para avaliações de livros feitas pelos usuários
    """
    
    # Relacionamentos
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='avaliacoes',
        verbose_name='Usuário'
    )
    
    livro = models.ForeignKey(
        Livro,
        on_delete=models.CASCADE,
        related_name='avaliacoes',
        verbose_name='Livro'
    )
    
    # Campos da avaliação
    texto = models.TextField(
        max_length=1000,
        verbose_name='Texto da Avaliação',
        help_text='Comentário sobre o livro (máximo 1000 caracteres)'
    )
    
    curtidas = models.PositiveIntegerField(
        default=0,
        verbose_name='Curtidas',
        help_text='Número de curtidas que esta avaliação recebeu'
    )
    
    data_publicacao = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data de Publicação'
    )
    
    # Metadados
    class Meta:
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'
        ordering = ['-data_publicacao']
        
        # Um usuário só pode avaliar um livro uma vez
        unique_together = ('usuario', 'livro')
        
        # Índices para melhor performance
        indexes = [
            models.Index(fields=['livro', '-data_publicacao']),
            models.Index(fields=['usuario', '-data_publicacao']),
        ]
    
    def __str__(self):
        return f'{self.usuario.username} - {self.livro.titulo}'
    
    @property
    def usuario_nome(self):
        """Retorna o nome do usuário ou username se nome não existir"""
        if hasattr(self.usuario, 'first_name') and self.usuario.first_name:
            return f"{self.usuario.first_name} {self.usuario.last_name}".strip()
        return self.usuario.username


class CurtidaAvaliacao(models.Model):
    """
    Modelo para controlar quais usuários curtiram quais avaliações
    """
    
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='curtidas_avaliacoes',
        verbose_name='Usuário'
    )
    
    avaliacao = models.ForeignKey(
        Avaliacao,
        on_delete=models.CASCADE,
        related_name='curtidas_usuarios',
        verbose_name='Avaliação'
    )
    
    data_curtida = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data da Curtida'
    )
    
    class Meta:
        verbose_name = 'Curtida de Avaliação'
        verbose_name_plural = 'Curtidas de Avaliações'
        unique_together = ('usuario', 'avaliacao')
    
    def __str__(self):
        return f'{self.usuario.username} curtiu avaliação de {self.avaliacao.livro.titulo}'
