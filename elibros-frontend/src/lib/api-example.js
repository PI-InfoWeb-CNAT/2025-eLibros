// Exemplo de como conectar e usar a API Django no Next.js
// src/lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1';

// Função genérica para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Exemplo de funções específicas da API
export const apiService = {
  // Buscar todos os livros
  async getLivros() {
    return apiRequest('/livros/');
  },

  // Buscar livro por ID
  async getLivro(id) {
    return apiRequest(`/livros/${id}/`);
  },

  // Buscar livros em destaque
  async getLivrosDestaque() {
    return apiRequest('/livros/destaque/');
  },

  // Buscar lançamentos
  async getLancamentos() {
    return apiRequest('/livros/lancamentos/');
  },

  // Pesquisar livros
  async pesquisarLivros(query) {
    return apiRequest(`/livros/?search=${encodeURIComponent(query)}`);
  },

  // Login
  async login(email, senha) {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },

  // Criar conta
  async criarConta(userData) {
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Buscar carrinho
  async getCarrinho() {
    return apiRequest('/carrinho/');
  },

  // Adicionar item ao carrinho
  async adicionarAoCarrinho(livroId, quantidade = 1) {
    return apiRequest('/carrinho/adicionar/', {
      method: 'POST',
      body: JSON.stringify({ livro_id: livroId, quantidade }),
    });
  },
};

export default apiService;