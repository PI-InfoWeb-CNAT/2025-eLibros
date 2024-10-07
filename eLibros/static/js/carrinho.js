var botao_adicionarAoCarrinho = document.getElementsByClassName('botaoAdicionarAoCarrinho')[0]; //ADICIONAR AO CARRINHO
var botao_comprarAgora = document.getElementsByClassName('botaoComprarAgora')[0];
var botoes_removerDoCarrinho = document.getElementsByClassName('botaoRemoverDoCarrinho'); //LIXEIRA

var botoes = [botao_adicionarAoCarrinho, botao_comprarAgora, ...botoes_removerDoCarrinho];
console.log('Botoes:', botoes);

botoes.forEach(function(botao) {
    if (botao != undefined){
        botao.addEventListener('click', function() {     
            var id = this.dataset.id;
            var action = this.dataset.action;
            if (action === 'remover') {
                var quantidadeAdicionada = document.getElementById(`quantity${id}`).value;
            }
            else {
                var quantidadeAdicionada = document.getElementById(`quantity`).value;
            }
            
            console.log('ID:', id, 'Action:', action, 'Quantidade JS:', quantidadeAdicionada, 'CSRF:', csrfToken);
    
            if(user === 'AnonymousUser'){
                console.log('Usuario nao logado');
            }else {
                updateUserCart(id, action, quantidadeAdicionada, csrfToken);
    
            }
    
        });
    }
    
});



function updateUserCart(id, action, quantidadeAdicionada, csrfToken){
    console.log('Usuario logado, enviando dados...');

    var url = '/atualizar_carrinho';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({'id': id, 'action': action, 'quantidadeAdicionada': quantidadeAdicionada}),
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log('Data:', data);
        if (data.redirect) {
            window.location.href = data.url;
        } else {
            console.log(data.message);
            if (action === 'remover') {
                var itemElement = document.querySelector(`button[data-id="${id}"]`).closest('li');
                itemElement.remove();
            }

            var cartItemCountElement = document.querySelector('.carrinho-quantidade');
            cartItemCountElement.textContent = data.cartItemCount
          
          
        }
    });
}