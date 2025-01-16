from django.http import JsonResponse
from elibrosLoja.models import Carrinho, Pedido, Cupom, Cliente, Endereco
from django.shortcuts import render, redirect
from decimal import Decimal
from django.utils import timezone
import requests


def aplicar_cupom(request):
    if request.method == 'POST':
        codigo_cupom = request.POST.get('codigo_cupom')
        try:
            cupom = Cupom.objects.get(codigo=codigo_cupom, ativo=True)
            if cupom.get_validade == False:
                return JsonResponse({'error': 'Cupom expirado'}, status=400)
                  
            subtotal = Decimal(request.session.get('subtotal', 0))
            if cupom.tipo_valor == "1":  # porcentagem
                valor_desconto = subtotal * (cupom.valor / 100)
            else:  # valor fixo
                valor_desconto = Decimal(cupom.valor)

            valor_total = subtotal - valor_desconto + Decimal(request.session.get('frete', 0))

            request.session['desconto'] = float(valor_desconto)
            request.session['valor_total'] = float(valor_total)
            return JsonResponse({'valor_desconto': float(valor_desconto), 'valor_total': float(valor_total)}, safe=False)

        except Cupom.DoesNotExist:
            return JsonResponse({'error': 'Cupom inválido ou expirado'}, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

def remover_cupom(request):
    if request.method == 'POST':
        request.session.pop('desconto', None)
        request.session.pop('valor_total', None)
        subtotal = request.session.get('subtotal', 0)
        return JsonResponse({'subtotal':subtotal,'redirect': True, 'url': '/pedido/finalizar_compra/'}, safe=False)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

def finalizar_compra(request):
    if request.user.is_authenticated:
        
        if request.method == 'GET':
            cliente = Cliente.objects.get(user=request.user)
            carrinho = Carrinho.objects.get(cliente=cliente)
            items = carrinho.items_do_carrinho.all()
            subtotal = sum([item.livro.preco * item.quantidade for item in items])
            quantia_itens = sum([item.quantidade for item in items])
            
            frete = Decimal('12.99')
            request.session['frete'] = float(frete)
            request.session['subtotal'] = float(subtotal)

            if 'desconto' in request.session:
                desconto = Decimal(request.session['desconto'])
            else:
                desconto = Decimal('0.00')

            valor_total = (subtotal - desconto) + frete
            context = {'frete': frete, 'subtotal': subtotal, 'quantia_itens': quantia_itens, 'items': items, 'desconto': desconto, 'valor_total': valor_total}
            return render(request, 'elibrosLoja/finalizar_compra.html', context=context)
       
    else:
        #redirecionar para página de login
        return redirect('login')

def finalizar_compra_postback(request):
    if request.method == 'POST':
        cliente = Cliente.objects.get(user=request.user)
        carrinho = Carrinho.objects.get(cliente=cliente)
        items = carrinho.items_do_carrinho.all()

        # Get address details from the form
        cep = request.POST.get('cep')
        rua = request.POST.get('rua')
        numero = request.POST.get('numero')
        complemento = request.POST.get('complemento')
        cidade = request.POST.get('cidade')
        estado = request.POST.get('estado')

        # Create or get the address
        endereco, created = Endereco.objects.get_or_create(
            cep=cep,
            rua=rua,
            numero=numero,
            complemento=complemento,
            cidade=cidade,
            uf=estado,
        )

        # Calculate totals
        subtotal = sum([item.livro.preco * item.quantidade for item in items])
        frete = Decimal(request.session.get('frete', 0))
        desconto = Decimal(request.session.get('desconto', 0))
        valor_total = subtotal - desconto + frete

        # Create the order
        pedido = Pedido.objects.create(
            cliente=cliente,
            endereco=endereco,
            data_de_pedido=timezone.now(),
            entrega_estimada=timezone.now() + timezone.timedelta(days=7),
            valor_total=valor_total,
            desconto=desconto,
            quantia_itens=sum([item.quantidade for item in items]),
        )

        # Add items to the order
        for item in items:
            pedido.itens.add(item)

        # Clear the cart
        carrinho.items_do_carrinho.clear()

        return redirect('pedidos')

    return redirect('finalizar_compra')

def pedidos(request):
    user = request.user
    if not user.is_authenticated:
        return redirect('login')
    cliente = Cliente.objects.get(user=user)
    pedidos = Pedido.objects.filter(cliente=cliente)

    pedidos_andamento = []
    pedidos_enviados = []
    pedidos_finalizados = []

    for pedido in pedidos:
        print(pedido.itens.all())

        if pedido.status == 'ENT':
            pedidos_finalizados.append(pedido)
        elif pedido.status == 'ENV':
            pedidos_enviados.append(pedido)
        elif pedido.status == 'CAN':
            continue
        else:
            pedidos_andamento.append(pedido)


    context = {
        'pedidos': pedidos,
        'pedidos_andamento': pedidos_andamento,
        'pedidos_finalizados': pedidos_finalizados,
        'pedidos_enviados': pedidos_enviados
    }
    return render(request, 'elibrosLoja/pedidos.html', context=context)

def cancelar_pedido(request, numero_pedido):
    if request.method == 'POST':
        cliente = Cliente.objects.get(user=request.user)
        pedidos = Pedido.objects.filter(numero_pedido=numero_pedido, cliente=cliente).all()

        for pedido in pedidos:
            if pedido.status in ['ENV', 'ENT']:
                pedido.status = 'CAN'
                pedido.save()

        return redirect('pedidos')
    return redirect('pedidos')

def confirmar_recebimento(request, numero_pedido):
    if request.method == 'POST':
        cliente = Cliente.objects.get(user=request.user)
        pedidos = Pedido.objects.filter(numero_pedido=numero_pedido, cliente=cliente).all()

        for pedido in pedidos:
            if pedido.status == 'ENV':
                pedido.status = 'ENT'
                pedido.save()

        return redirect('pedidos')
    return redirect('pedidos')