// Script de teste para verificar a conexão com a API Django
const API_URL = 'https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1';

async function testAPI() {
  try {
    console.log('Testando conexão com a API Django...');
    console.log('URL da API:', API_URL);
    
    // Teste básico de conectividade
    const response = await fetch(`${API_URL}/livros/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexão com a API estabelecida com sucesso!');
      console.log('Dados recebidos:', data);
    } else {
      console.log('❌ Erro na resposta da API:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com a API:', error.message);
  }
}

testAPI();