document.addEventListener('DOMContentLoaded', function() {
    const cupomSection = document.getElementById('cupom-section');
    const cupomInput = cupomSection?.querySelector('input[name="codigo_cupom"]');
    const aplicarCupomBtn = document.getElementById('aplicar-cupom');
    const cupomAplicado = document.getElementById('cupom-aplicado');
    const codigoCupomSpan = document.getElementById('codigo-cupom');

    if (!cupomAplicado || !codigoCupomSpan) {
        console.warn('Required elements not found');
        return;
    }

    aplicarCupomBtn.addEventListener('click', function() {
        const formData = new FormData();
        formData.append('codigo_cupom', cupomInput.value);

        fetch('/pedido/aplicar_cupom/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                const discountElement = document.querySelector('#total .valores:nth-child(2) p:last-child');
                const totalElement = document.querySelector('#total .valores:nth-child(4) p:last-child');

                if (discountElement && totalElement) {
                    discountElement.textContent = `- R$ ${data.valor_desconto.toFixed(2)}`;
                    totalElement.textContent = `R$ ${data.valor_total.toFixed(2)}`;
                }

                console.log('Cupom input value', cupomInput.value);
                codigoCupomSpan.textContent = cupomInput.value;
                
                cupomAplicado.style.display = 'block';


                cupomInput.disabled = true;
                // Update URL without reload
                window.history.pushState({}, '', '/pedido/finalizar_compra');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    

    // Handle remove cupom button
    document.querySelector('.remove-cupom')?.addEventListener('click', function() {
        
        
        fetch('/pedido/remover_cupom/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            cupomInput.value = '';
            cupomInput.disabled = false;
            cupomAplicado.style.display = 'none';
            
            const subtotalElement = document.querySelector('#total .valores:nth-child(1) p:last-child');
            const discountElement = document.querySelector('#total .valores:nth-child(2) p:last-child');
            const totalElement = document.querySelector('#total .valores:nth-child(4) p:last-child');

            if (discountElement && totalElement) {
                discountElement.textContent = "---"
                totalElement.textContent =  subtotalElement.textContent;
            }
        });
    });
});