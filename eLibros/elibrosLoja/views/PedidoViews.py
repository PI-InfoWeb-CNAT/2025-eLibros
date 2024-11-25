from django.http import JsonResponse
from elibrosLoja.models import Carrinho, Pedido, Desconto
from django.shortcuts import render

def aplicar_cupom(request):
    if request.method == 'POST':
        codigo_cupom = request.POST.get('codigo_cupom')
        try:
            desconto = Desconto.objects.get(codigo=codigo_cupom, ativo=True)
            valor_total_com_desconto = request.session.get('valor_total') * desconto.valor
            return JsonResponse({'valor_total': valor_total_com_desconto})

        except Desconto.DoesNotExist:
            return JsonResponse({'error': 'Cupom inválido ou expirado'}, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

def finalizar_compra(request):
    if request.user.is_authenticated:
        
        if request.method == 'GET':
            items = carrinho.items_do_carrinho.all() if carrinho else []

            subtotal = sum([item.produto.preco * item.quantia_itens for item in items])
            quantia_itens = sum([item.quantidade for item in items])

            frete = 12,99

            valor_total = subtotal + frete
            request.session['valor_total'] = valor_total

            context = {'frete': frete, 'subtotal': subtotal, 'quantia_itens': quantia_itens, 'items': items}

            return render(request, 'elibrosLoja/finalizar_compra.html', context=context)
       
    else:
        #redirecionar para página de login
        session_id = request.session.get('session_id')
        carrinho = Carrinho.objects.filter(session_id=session_id).first()

def finalizar_compra_postback(request):
   # cria entidade pedido para armazenar no banco de dados
   pass