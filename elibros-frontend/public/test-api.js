// Teste simples da API
const API_URL = 'http://localhost:8000/api/v1';

async function testAPI() {
    try {
        console.log('Testando conexão com a API...');
        
        const response = await fetch(`${API_URL}/livros/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Status da resposta:', response.status);
        console.log('Headers:', response.headers);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Dados recebidos:', data);
            console.log('Número de livros:', data.results?.length || 0);
        } else {
            console.error('Erro na resposta:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Executar teste quando a página carregar
if (typeof window !== 'undefined') {
    window.addEventListener('load', testAPI);
}
