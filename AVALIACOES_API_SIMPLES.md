# 📖 API de Avaliações - eLibros (Versão Simplificada)

## 🎯 Visão Geral

Sistema simples de avaliações para a página de livros. Os usuários podem:
- ✅ **Ver avaliações** na página do livro
- ✅ **Escrever uma avaliação** por livro
- ✅ **Curtir avaliações** de outros usuários

## 🔗 Endpoints Disponíveis

### 1️⃣ Listar/Criar Avaliações de um Livro
```
GET/POST /api/v1/livros/{livro_id}/avaliacoes/
```

**GET** - Lista todas as avaliações do livro:
```json
[
  {
    "id": 1,
    "usuario_nome": "João Silva",
    "texto": "Livro excelente! Recomendo muito.",
    "curtidas": 5,
    "data_publicacao": "2025-01-20T10:30:00Z",
    "usuario_curtiu": false
  }
]
```

**POST** - Cria nova avaliação (requer login):
```json
{
  "texto": "Adorei este livro! A história é muito envolvente."
}
```

### 2️⃣ Curtir/Descurtir Avaliação
```
POST/DELETE /api/v1/avaliacoes/{avaliacao_id}/curtir/
```

**POST** - Curtir avaliação
**DELETE** - Remover curtida

Resposta:
```json
{
  "detail": "Avaliação curtida com sucesso"
}
```

## ⚠️ Regras de Negócio

- ✅ **Um usuário só pode avaliar um livro uma vez**
- ✅ **Usuário não pode curtir própria avaliação**
- ✅ **Texto mínimo de 10 caracteres**

## 🔐 Autenticação

- **Ver avaliações**: Não precisa de login
- **Criar avaliação**: Precisa estar logado
- **Curtir avaliação**: Precisa estar logado

Use JWT token no header:
```
Authorization: Bearer seu_token_aqui
```

## 💻 Exemplo de Uso no Frontend

```javascript
// Buscar avaliações do livro
const avaliacoes = await fetch('/api/v1/livros/1/avaliacoes/');

// Criar avaliação
await fetch('/api/v1/livros/1/avaliacoes/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    texto: 'Ótimo livro!'
  })
});

// Curtir avaliação
await fetch('/api/v1/avaliacoes/1/curtir/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

## ✅ Sistema Pronto!

O backend está completo e pronto para seu amigo integrar no frontend da página de livros! 🎉
