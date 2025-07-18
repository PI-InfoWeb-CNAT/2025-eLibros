// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

// URLs dos endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REFRESH: '/auth/refresh/',
    LOGOUT: '/auth/logout/',
  },
  LIVROS: {
    LIST: '/livros/',
    DETAIL: (id: number) => `/livros/${id}/`,
    DESTAQUE: '/livros/destaque/',
    LANCAMENTOS: '/livros/lancamentos/',
  },
  CATEGORIAS: '/categorias/',
  AUTORES: '/autores/',
  GENEROS: '/generos/',
  ESTATISTICAS: '/estatisticas/',
  INICIO: '/inicio/',
};
