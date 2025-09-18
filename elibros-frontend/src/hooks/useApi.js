// Hook personalizado para usar a API no React
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint, API_BASE_URL]);

  return { data, loading, error };
}

// Hook específico para livros
export function useLivros() {
  return useApi('/livros/');
}

// Hook específico para livros em destaque
export function useLivrosDestaque() {
  return useApi('/livros/destaque/');
}

// Hook específico para lançamentos
export function useLancamentos() {
  return useApi('/livros/lancamentos/');
}

// Hook para buscar um livro específico
export function useLivro(id) {
  return useApi(id ? `/livros/${id}/` : null);
}