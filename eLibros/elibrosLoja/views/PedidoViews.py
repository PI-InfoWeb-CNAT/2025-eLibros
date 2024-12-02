from django.http import JsonResponse
from utils.context_processors import carrinho
from elibrosLoja.models import Carrinho, Pedido, Desconto
from django.shortcuts import render, redirect

def aplicar_cupom(request):
    if request.method == 'POST':
        codigo_cupom = request.POST.get('codigo_cupom')
        try:
            desconto = Desconto.objects.get(codigo=codigo_cupom, ativo=True)            
            subtotal_com_desconto = request.session.get('subtotal', 0) * desconto.valor
            valor_desconto = request.session.get('subtotal', 0) - subtotal_com_desconto
            valor_total = subtotal_com_desconto + request.session.get('frete', 0)

            request.session['desconto'] = valor_desconto
            request.session['valor_total'] = valor_total
            return JsonResponse({'valor_desconto': valor_desconto, 'valor_total': valor_total})

        except Desconto.DoesNotExist:
            return JsonResponse({'error': 'Cupom inválido ou expirado'}, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

def finalizar_compra(request):
    if request.user.is_authenticated:
        
        if request.method == 'GET':
            items = carrinho.items_do_carrinho.all() if carrinho else []

            subtotal = sum([item.produto.preco * item.quantia_itens for item in items])
            quantia_itens = sum([item.quantidade for item in items])
            
            frete = 12.99
            request.session['frete'] = frete
            request.session['subtotal'] = subtotal

            if 'desconto' in request.session:
                desconto = request.session['desconto']
            else: desconto = 0

            valor_total = (subtotal - desconto) + frete
            context = {'frete': frete, 'subtotal': subtotal, 'quantia_itens': quantia_itens, 'items': items, 'desconto': desconto, 'valor_total': valor_total}
            return render(request, 'elibrosLoja/finalizar_compra.html', context=context)
       
    else:
        #redirecionar para página de login
        return redirect('login')

def finalizar_compra_postback(request):
   # cria entidade pedido para armazenar no banco de dados
   pass