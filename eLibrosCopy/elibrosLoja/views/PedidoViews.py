from django.shortcuts import render, redirect
from elibrosLoja.models import Pedido, Cliente
from django.contrib.auth.decorators import login_required
from django.utils import timezone

class PedidoViews:

    @login_required
    def pedidos(request):
        user = request.user
        if not user.is_authenticated:
            return redirect('login')
        cliente = Cliente.objects.get(user=user)
        pedidos = Pedido.objects.filter(cliente=cliente)

        pedidos_andamento = []
        pedidos_enviados = []
        pedidos_finalizados = []
        pedidos_cancelados = []

        for pedido in pedidos:

            if pedido.status == 'ENT':
                pedidos_finalizados.append(pedido)
            elif pedido.status == 'ENV':
                pedidos_enviados.append(pedido)
            elif pedido.status == 'CAN':
                pedidos_cancelados.append(pedido)
            else:
                pedidos_andamento.append(pedido)


        context = {
            'pedidos': pedidos,
            'pedidos_andamento': pedidos_andamento,
            'pedidos_finalizados': pedidos_finalizados,
            'pedidos_enviados': pedidos_enviados,
            'pedidos_cancelados': pedidos_cancelados
        }
        return render(request, 'elibrosLoja/pedidos.html', context=context)

    @login_required
    def ver_pedido(request, numero_pedido):
        pedido = Pedido.objects.get(numero_pedido=numero_pedido)
        itens = pedido.itens.all()
        context = {
            'pedido': pedido,
            'itens': itens
        }
        return render(request, 'elibrosLoja/ver_pedido.html', context=context)
    
    @login_required
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
    

    @login_required
    def cancelar_pedido(request, numero_pedido):
        if request.method == 'POST':
            cliente = Cliente.objects.get(user=request.user)
            pedidos = Pedido.objects.filter(numero_pedido=numero_pedido, cliente=cliente).all()

            for pedido in pedidos:
                if pedido.status not in ['ENV', 'ENT']:
                    pedido.status = 'CAN'
                    pedido.data_de_cancelamento = timezone.now()
                    pedido.save()

            return redirect('pedidos')
        return redirect('pedidos')
