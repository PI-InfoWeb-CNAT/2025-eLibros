document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('finalizar-compra-form');
    const outroEnderecoDiv = document.querySelector('.outroendereco');
    const enderecoInputs = outroEnderecoDiv.querySelectorAll('input, select');
    const radioButtons = document.querySelectorAll('input[name="endereco_tipo"]');

    // Initial setup
    outroEnderecoDiv.style.display = 'none';

    radioButtons.forEach(radio => {
        console.log(radio);
        radio.addEventListener('change', () => {
            if (radio.value === 'outro_endereco') {
                outroEnderecoDiv.style.display = 'block';
            } else {
                outroEnderecoDiv.style.display = 'none';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        const selectedRadio = document.querySelector('input[name="endereco_tipo"]:checked');
        if (selectedRadio.value === 'outro_endereco') {
            const emptyRequired = Array.from(enderecoInputs)
                .filter(input => input.required && !input.value.trim());
            if (emptyRequired.length > 0) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios do endereço.');
            }
        }
    });
});