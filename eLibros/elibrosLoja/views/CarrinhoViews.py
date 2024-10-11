import json, uuid

from elibrosLoja.models import Livro, Carrinho, ItemCarrinho
from django.shortcuts import render
# from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required





def atualizar_carrinho(request):
    data = json.loads(request.body)
    id = data['id'] #id do livro ou id do itemCarrinho
    action = data['action'] #adicionarAoCarrinho, comprarAgora, deletar, adicionar, remover
    quantidade = data['quantidadeAdicionada']

    # livro = Livro.objects.get(id=id)
    if request.user.is_authenticated:
        #Cliente logado
        cliente = request.user
        carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
    else:
        #Usuário anônimo
        session_id = request.session.get('session_id', str(uuid.uuid4()))
        request.session['session_id'] = session_id
        carrinho, created = Carrinho.objects.get_or_create(session_id=session_id)

    if action in ['adicionarAoCarrinho', 'comprarAgora']: #foi passado via JS para o backend um id de livro
        livro = Livro.objects.get(id=id)

        item_carrinho, item_created = ItemCarrinho.objects.get_or_create(
            livro=livro,
            defaults={'quantidade': int(quantidade), 'preco': livro.preco}
        )

        if not item_created:
            item_carrinho.quantidade += int(quantidade)
        else:
            item_carrinho.quantidade = int(quantidade)

        item_carrinho.save()
        if item_carrinho not in carrinho.items.all():
            carrinho.items.add(item_carrinho)
        message = 'Item foi adicionado ao carrinho'

        cart_item_count = carrinho.numero_itens
        if action == 'comprarAgora':
            return JsonResponse({'redirect': True, 'url': '/carrinho/'}, safe=False)
    else:
        #foi passado via JS para o backend um id de um ItemCarrinho
        item_carrinho = ItemCarrinho.objects.get(id=id)
        if action == 'deletar':
            if item_carrinho in carrinho.items.all():
                carrinho.items.remove(item_carrinho)
                item_carrinho.delete()
                message = 'Item foi removido do carrinho'
            else:
                message = 'Tentou-se remover Item mas ele não está no carrinho'
        else:
            if action == 'adicionar':
                item_carrinho.quantidade += 1
            elif action == 'remover' and item_carrinho.quantidade > 1:
                item_carrinho.quantidade -= 1

            item_carrinho.save()
            carrinho.save()
            message = 'Item foi atualizado ao carrinho'


    cart_item_count = carrinho.numero_itens
    return JsonResponse({'message': message, 'cartItemCount': cart_item_count}, safe=False)


def ver_carrinho(request):
    context = {
        }
    return render(request, 'elibrosLoja/carrinho.html', context=context)





