document.getElementById('cupom-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': form.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            document.querySelector('#total .valores:nth-child(2) p:last-child').textContent = `R$ ${data.valor_desconto.toFixed(2)}`;
            document.querySelector('#total .valores:nth-child(4) p:last-child').textContent = `R$ ${data.valor_total.toFixed(2)}`;
        }
    })
    .catch(error => console.error('Error:', error));
});