import json, uuid

from django.shortcuts import render, redirect
from decimal import Decimal
from django.utils import timezone
# from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from elibrosLoja.models import Livro, Carrinho, ItemCarrinho, Carrinho, Pedido, Cupom, Cliente, Endereco

class CarrinhoViews:

    def atualizar_carrinho(request):
        try:
            data = json.loads(request.body)
            id = data['id'] #id do livro ou id do itemCarrinho
            print(f'ID: {id}')
            action = data['action'] #adicionarAoCarrinho, comprarAgora, deletar, adicionar, remover
            print(f'Action: {action}')
            quantidade = data['quantidadeAdicionada']
            print(f'Quantidade: {quantidade}')

            # livro = Livro.objects.get(id=id)
            if request.user.is_authenticated:
                #Cliente logado
                cliente = Cliente.objects.get(user=request.user)
                carrinho, created = Carrinho.objects.get_or_create(cliente=cliente)
                
                
            else:
                #Usuário anônimo
                session_id = request.session.get('session_id', str(uuid.uuid4()))
                request.session['session_id'] = session_id
                request.session['teste'] = "teste"
                carrinho, created = Carrinho.objects.get_or_create(session_id=session_id)
        
                

            if action in ['adicionarAoCarrinho', 'comprarAgora']: 
                livro = Livro.objects.get(id=id)
                item_carrinho, item_created = ItemCarrinho.objects.get_or_create(
                    livro=livro,
                    carrinho=carrinho,
                    defaults={'quantidade': int(quantidade), 'preco': livro.preco, 'carrinho': carrinho}
                )

                if not item_created:
                    item_carrinho.quantidade += int(quantidade)
                else:
                    item_carrinho.quantidade = int(quantidade)

                item_carrinho.save()
                message = 'Item foi adicionado ao carrinho'
                cart_item_count = carrinho.numero_itens

                if action == 'comprarAgora':
                    return JsonResponse({'redirect': True, 'url': '/carrinho/'}, safe=False)
            else:
                #foi passado via JS para o backend um id de um ItemCarrinho
                item_carrinho = ItemCarrinho.objects.get(id=id)
                if action == 'deletar':
                    item_carrinho.delete()
                    message = 'Item foi removido do carrinho'

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
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


    def ver_carrinho(request):
        if request.user.is_authenticated:
            cliente = Cliente.objects.get(user=request.user)
            carrinho = Carrinho.objects.filter(cliente=cliente).first()
        else:
            session_id = request.session.get('session_id')
            carrinho = Carrinho.objects.filter(session_id=session_id).first()

        items = carrinho.items_do_carrinho.all() if carrinho else []
    
        context = {
            'items': items,
        }
        return render(request, 'elibrosLoja/carrinho.html', context=context)


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
            
            return redirect('login')

    def finalizar_compra_postback(request):
        if request.method == 'POST':
            try:
                cliente = Cliente.objects.get(user=request.user)
                carrinho = Carrinho.objects.get(cliente=cliente)
                items = carrinho.items_do_carrinho.all()

                endereco_tipo = request.POST.get('endereco_tipo')
                
                # Handle address creation/selection
                if endereco_tipo == 'meu_endereco':
                    if not cliente.endereco:
                        return redirect('finalizar_compra')
                    endereco = cliente.endereco
                elif endereco_tipo == 'outro_endereco':
                    try:
                        # Validate and create new address
                        numero = request.POST.get('numero')
                        if not numero or not numero.isdigit() or int(numero) <= 0:
                            raise ValueError("Número inválido")
                            
                        endereco = Endereco.objects.create(
                            cep=request.POST.get('cep'),
                            rua=request.POST.get('rua'),
                            numero=int(numero),
                            complemento=request.POST.get('complemento', ''),
                            cidade=request.POST.get('cidade'),
                            uf=request.POST.get('estado')
                        )
                    except (ValueError, TypeError) as e:
                        print(f"Error creating address: {str(e)}")
                        return redirect('finalizar_compra')
            

                
                subtotal = sum([item.livro.preco * item.quantidade for item in items])
                
                sum([item.livro.qtd_vendidos + item.quantidade for item in items])

                frete = Decimal(request.session.get('frete', 0))
                desconto = Decimal(request.session.get('desconto', 0))
                valor_total = subtotal - desconto + frete

        
                pedido = Pedido.objects.create(
                    cliente=cliente,
                    endereco=endereco,
                    data_de_pedido=timezone.now(),
                    entrega_estimada=timezone.now() + timezone.timedelta(days=7),
                    valor_total=valor_total,
                    desconto=desconto,
                    quantia_itens=sum([item.quantidade for item in items]),
                )

            
                
                for item in items:
                    pedido.itens.add(item)

                
                carrinho.items_do_carrinho.clear()

                return redirect('pedidos')
            
            except Exception as e:
                print(f"Error: {str(e)}")
            return redirect('finalizar_compra')

        return redirect('finalizar_compra')





