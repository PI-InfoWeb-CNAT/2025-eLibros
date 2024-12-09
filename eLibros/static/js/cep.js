document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.querySelector('input[placeholder="_____-___"]');
    const ruaInput = document.querySelector('input[placeholder="_______________________________________"]');
    const numeroInput = document.querySelector('input[placeholder="____"]');
    const cidadeInput = document.querySelector('input[placeholder="____________________________________"]');
    const estadoSelect = document.querySelector('select');
    const complementoInput = document.querySelector('input[size="40"]');
    const mainForm = document.getElementById('finalizar-compra-form');

    // Function to fetch address from ViaCEP API
    function fetchAddressFromCep(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    // Format rua field with street and neighborhood
                    ruaInput.value = `${data.logradouro}, ${data.bairro}`;
                    // Fill other fields
                    cidadeInput.value = data.localidade;
                    estadoSelect.value = data.uf;
                    complementoInput.value = data.complemento;
                } else {
                    alert('CEP não encontrado');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao buscar CEP');
            });
    }

    // Function to validate the complete address using ViaCEP API
    function validateAddress() {
        const estado = estadoSelect.value;
        const cidade = cidadeInput.value;
        const rua = ruaInput.value.split(',')[0];

        if (estado.length < 2 || cidade.length < 3 || rua.length < 3) {
            alert('Por favor, preencha todos os campos obrigatórios com pelo menos 3 caracteres.');
            return false;
        }

        const url = `https://viacep.com.br/ws/${estado}/${cidade}/${rua}/json/`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao validar endereço');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    alert('Endereço inválido: ' + data.erro);
                    return false;
                } else {
                    return true;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao validar endereço');
                return false;
            });
    }

    // Event listener for CEP input
    cepInput.addEventListener('input', function(e) {
        // Remove non-digits
        let cep = this.value.replace(/\D/g, '');

        // Make API call when 8 digits are entered
        if (cep.length === 8) {
            fetchAddressFromCep(cep);
        }
    });

    mainForm?.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Check if all required fields are filled
        const requiredFields = [ruaInput, numeroInput, cidadeInput, estadoSelect, cepInput];
        const areAllFilled = requiredFields.every(field => field.value.trim() !== '');
        
        if (areAllFilled) {
            validateAddress().then(isValid => {
                if (isValid) {
                    this.submit();
                }
            });
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });
});