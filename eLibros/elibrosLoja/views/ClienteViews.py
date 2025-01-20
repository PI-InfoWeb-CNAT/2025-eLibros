from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from elibrosLoja.forms import UserImageForm
from elibrosLoja.models import Cliente, Pedido

class ClienteViews:

    @login_required
    def perfil(request):
        cliente = Cliente.objects.get(user=request.user)
        if request.method == 'POST':
            form = UserImageForm(request.POST, request.FILES, instance=cliente)
            if form.is_valid():
                form.save()
                return redirect('perfil')  # Redirect to the same page to see the changes
        else:
            form = UserImageForm(instance=cliente)

        context = {
            'cliente': cliente,
            'form': form,
        }
        return render(request, 'elibrosLoja/perfil.html', context=context)

    @login_required
    def adicionar_endereco(request):
        pass

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

    @login_required
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