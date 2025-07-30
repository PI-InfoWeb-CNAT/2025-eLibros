from elibrosLoja.models import Carrinho
from elibrosLoja.models import Cliente
import re

def carrinho(request):
    try:
        if request.user.is_authenticated:
            cliente = Cliente.objects.get(user=request.user)
            carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
        else:
            carrinho, created = Carrinho.objects.get_or_create(session_id=request.session.get('session_id'))
    except:
        carrinho = {'total': 0, 'numero_itens': 0}
        print(carrinho)
    
    return {'carrinho': carrinho}

def cliente(request):
    try:
        cliente = Cliente.objects.get(user=request.user)
    except:
        cliente = None
    return {'cliente': cliente}

def remove_special_characters(text):
  special_chars = re.compile(r'[^a-zA-Z0-9]')
  return special_chars.sub('', text)

# def user(request):
#     try:
#         user = request.user
#     except:
#         user = None
#     return {'user': user}