# 📚 eLibros API - Documentação para Frontend

## 🔗 Base URL
```
http://localhost:8000/api/v1
```

## 🛡️ Autenticação

### Obter Token JWT
```typescript
POST /auth/login/
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}

// Resposta
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Usar Token nas Requisições
```typescript
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Renovar Token
```typescript
POST /auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 📖 Endpoints de Livros

### Listar Livros (Paginado)
```typescript
GET /livros/?page=1&search=termo

// Resposta
{
  "count": 14,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "titulo": "Corpos Secos",
      "subtitulo": null,
      "autores": ["Marcelo Ferroni", "Luisa Geisler"],
      "editora": "Alfaguara",
      "ISBN": "9788554516871",
      "data_de_publicacao": "2025-01-17",
      "ano_de_publicacao": 2020,
      "capa": "http://localhost:8000/media/capas/corpos-secos.jpg",
      "sinopse": "Uma doença fatal assola o Brasil...",
      "generos": ["Suspense"],
      "categorias": ["De tirar o folego"],
      "preco": "35.90",
      "desconto": null,
      "quantidade": 999,
      "qtd_vendidos": 0
    }
  ]
}
```

### Obter Livro Específico
```typescript
GET /livros/{id}/

// Resposta: mesmo formato do objeto livro acima
```

### Livros em Destaque
```typescript
GET /livros/destaque/

// Resposta: array de livros
[
  {
    "id": 1,
    "titulo": "...",
    // ... outros campos
  }
]
```

### Últimos Lançamentos
```typescript
GET /livros/lancamentos/

// Resposta: array de livros recentes
```

## 👤 Endpoints de Autores
```typescript
GET /autores/

// Resposta
[
  {
    "id": 1,
    "nome": "Machado de Assis",
    "criado_por": 1
  }
]
```

## 📚 Endpoints de Categorias
```typescript
GET /categorias/

// Resposta
[
  {
    "id": 1,
    "nome": "Romance",
    "descricao": "Livros de romance"
  }
]
```

## 🎭 Endpoints de Gêneros
```typescript
GET /generos/

// Resposta
[
  {
    "id": 1,
    "nome": "Ficção",
    "descricao": "Literatura de ficção"
  }
]
```

## 📊 Estatísticas
```typescript
GET /estatisticas/

// Resposta
{
  "total_livros": 14,
  "total_autores": 13,
  "total_categorias": 4,
  "total_generos": 3
}
```

## 🏠 Dados da Página Inicial
```typescript
GET /inicio/

// Resposta
{
  "livros_destaque": [...],
  "livros_lancamentos": [...],
  "livros_indicacoes": [...],
  "estatisticas": {...}
}
```

## 🛒 Endpoints de Carrinho

### Listar Itens do Carrinho
```typescript
GET /carrinho/
Authorization: Bearer token_jwt
```

### Adicionar ao Carrinho
```typescript
POST /carrinho/
Authorization: Bearer token_jwt
Content-Type: application/json

{
  "livro_id": 1,
  "quantidade": 2
}
```

## 📦 Endpoints de Pedidos

### Meus Pedidos
```typescript
GET /pedidos/
Authorization: Bearer token_jwt
```

### Criar Pedido
```typescript
POST /pedidos/
Authorization: Bearer token_jwt
Content-Type: application/json

{
  "endereco": {...},
  "cupom": "DESCONTO10",
  "itens": [...]
}
```

## 👥 Endpoints de Cliente

### Perfil do Cliente
```typescript
GET /cliente/
Authorization: Bearer token_jwt
```

### Atualizar Perfil
```typescript
PUT /cliente/
Authorization: Bearer token_jwt
Content-Type: application/json

{
  "nome": "João Silva",
  "telefone": "(84) 99999-9999",
  "endereco": {...}
}
```

## 🚀 Exemplo de Uso no React

### Serviço API
```typescript
// services/api.ts
import { elibrosApi } from '@/services/api';

// Buscar livros
const livros = await elibrosApi.getLivros(1, 'pesquisa');

// Fazer login
const tokens = await elibrosApi.login('email@exemplo.com', 'senha');

// Obter estatísticas
const stats = await elibrosApi.getEstatisticas();
```

### Componente React
```typescript
'use client';

import { useState, useEffect } from 'react';
import { elibrosApi, Livro } from '@/services/api';

export default function LivrosList() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await elibrosApi.getLivros();
        setLivros(response.results);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {livros.map(livro => (
        <div key={livro.id}>
          <h3>{livro.titulo}</h3>
          <p>{livro.autores.join(', ')}</p>
          <p>R$ {livro.preco}</p>
        </div>
      ))}
    </div>
  );
}
```

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado (token inválido/expirado)
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

### Exemplo de Tratamento
```typescript
try {
  const livros = await elibrosApi.getLivros();
  // Sucesso
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('401')) {
      // Token expirado, fazer login novamente
      elibrosApi.logout();
      // Redirecionar para login
    } else if (error.message.includes('404')) {
      // Recurso não encontrado
      console.log('Livro não encontrado');
    } else {
      // Outros erros
      console.error('Erro na API:', error.message);
    }
  }
}
```

## 🔧 Configuração CORS

A API já está configurada para aceitar requisições do frontend:
- Origins permitidos: `http://localhost:3000`, `http://127.0.0.1:3000`
- Headers permitidos: `Authorization`, `Content-Type`
- Métodos permitidos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`

## 💡 Dicas para Desenvolvimento

1. **Cache de Tokens**: Use localStorage para persistir tokens JWT
2. **Interceptadores**: Implemente interceptadores para renovar tokens automaticamente
3. **Loading States**: Sempre forneça feedback visual durante requisições
4. **Error Boundaries**: Use Error Boundaries para capturar erros em componentes
5. **TypeScript**: Aproveite a tipagem forte para melhor DX

## 🔍 Debug e Logs

Para debug, monitore:
- Console do navegador (F12)
- Network tab para ver requisições HTTP
- Django logs no terminal do servidor
- Validação de CORS nas ferramentas de desenvolvedor
