from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from elibrosLoja.forms import UserImageForm
from elibrosLoja.models import Cliente

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
    return render(request, 'elibrosLoja/pedidos.html')