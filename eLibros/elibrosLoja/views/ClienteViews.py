from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from elibrosLoja.forms import UserImageForm
from elibrosLoja.models import Cliente

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
    def editar_perfil(request):
        cliente = Cliente.objects.get(user=request.user)
        if request.method == 'POST':
            cliente.user.username = request.POST['username']
            cliente.user.email = request.POST['email']
            cliente.user.telefone = request.POST['phone']
            cliente.user.genero = request.POST['genero']
            cliente.endereco = request.POST['address']
            cliente.user.save()
            cliente.save()
            return redirect('perfil')
        else:
            context = {
                'cliente': cliente
            }
            return render(request, 'elibrosLoja/editarperfil.html', context=context)

    @login_required
    def adicionar_endereco(request):
        pass
    
    @login_required
    def editar_endereco(request, id_endereco):
        pass

    @login_required
    def excluir_endereco(request, id_endereco):
        pass
   
    @login_required
    def excluir_conta(request):
        if request.method == 'POST':
            cliente = Cliente.objects.get(user=request.user)
            cliente.endereco.delete()
            cliente.user.foto_de_perfil = None
            cliente.user.telefone = None
            cliente.user.genero = None
            cliente.user.dt_nasc = None
            cliente.save()
            
            return redirect('inicio')