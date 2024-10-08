from elibrosLoja.models import Carrinho
import uuid

def carrinho(request):
    if request.user.is_authenticated:
        carrinho, created = Carrinho.objects.get_or_create(cliente=request.user)
    else:
        carrinho = request.session.get('carrinho', None)
        if carrinho is None:
            session_id = request.session.get('session_id', str(uuid.uuid4()))
            request.session['session_id'] = session_id
            carrinho = {'SessionID': request.session['session_id'], 'Itens': [], 'Total': 0, 'Numero_itens': 0}
            request.session['carrinho'] = carrinho
    
    return {'carrinho': carrinho}

def cliente(request):
    try:
        cliente = request.user
    except:
        cliente = None
    return {'cliente': cliente}