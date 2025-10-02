from typing import Optional
from django.contrib.auth import get_user_model
from elibrosLoja.models.cliente import Cliente
from elibrosLoja.models.administrador import Administrador

User = get_user_model()


def get_cliente_from_user(user) -> Optional[Cliente]:
    """
    Obtém o cliente associado ao usuário de forma segura.
    
    Args:
        user: Instância do usuário (pode ser Usuario ou AnonymousUser)
        
    Returns:
        Cliente se existir, None caso contrário
    """
    if not user or not user.is_authenticated:
        return None
    
    try:
        return Cliente.objects.get(user=user)
    except Cliente.DoesNotExist:
        return None


def get_or_create_cliente(user) -> Optional[Cliente]:
    """
    Obtém ou cria um cliente para o usuário.
    
    Args:
        user: Instância do usuário autenticado
        
    Returns:
        Cliente se criado com sucesso, None caso contrário
    """
    if not user or not user.is_authenticated:
        return None
    
    try:
        cliente, created = Cliente.objects.get_or_create(user=user)
        return cliente
    except Exception:
        return None


def get_administrador_from_user(user) -> Optional[Administrador]:
    """
    Obtém o administrador associado ao usuário de forma segura.
    
    Args:
        user: Instância do usuário (pode ser Usuario ou AnonymousUser)
        
    Returns:
        Administrador se existir, None caso contrário
    """
    if not user or not user.is_authenticated:
        return None
    
    try:
        return Administrador.objects.get(user=user)
    except Administrador.DoesNotExist:
        return None


def is_user_admin(user) -> bool:
    """
    Verifica se o usuário é administrador.
    
    Args:
        user: Instância do usuário
        
    Returns:
        True se for administrador, False caso contrário
    """
    if not user or not user.is_authenticated:
        return False
    
    # Verificar se é staff/superuser OU tem registro de Administrador
    return (
        user.is_staff or 
        user.is_superuser or
        Administrador.objects.filter(user=user).exists()
    )