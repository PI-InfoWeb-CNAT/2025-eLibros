from elibrosLoja.models import Carrinho, Pedido
from django.shortcuts import render

def finalizar_compra(request):
    if request.user.is_authenticated:
        #okay para acessar página de finalizar compra
        cliente = request.user
        carrinho = Carrinho.objects.filter(cliente=cliente).first()
        items = carrinho.items_do_carrinho.all() if carrinho else []
        pedido = Pedido.objects.create(cliente=cliente, items=items)
        return render(request, 'elibrosLoja/finalizar_compra.html', context={'pedido': pedido})
    else:
        #redirecionar para página de login
        session_id = request.session.get('session_id')
        carrinho = Carrinho.objects.filter(session_id=session_id).first()