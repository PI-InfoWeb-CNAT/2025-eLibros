# 📚 API de Avaliações do eLibros

## 🎯 Endpoints Disponíveis

### 📖 **Avaliações de um livro**
```
GET  /api/v1/livros/{livro_id}/avaliacoes/     # Listar avaliações
POST /api/v1/livros/{livro_id}/avaliacoes/     # Criar avaliação (autenticado)
```

### 🔧 **Gerenciar avaliação específica**
```
PUT    /api/v1/avaliacoes/{avaliacao_id}/      # Editar (apenas próprio usuário)
DELETE /api/v1/avaliacoes/{avaliacao_id}/      # Excluir (apenas próprio usuário)
```

### ❤️ **Curtir/Descurtir**
```
POST   /api/v1/avaliacoes/{avaliacao_id}/curtir/   # Curtir
DELETE /api/v1/avaliacoes/{avaliacao_id}/curtir/   # Descurtir
```

### 📊 **Estatísticas**
```
GET /api/v1/livros/{livro_id}/estatisticas/    # Stats de avaliações do livro
GET /api/v1/minhas-avaliacoes/                 # Avaliações do usuário logado
```

## 🔥 Exemplos de Uso

### 1. **Listar avaliações de um livro**
```javascript
// GET /api/v1/livros/1/avaliacoes/
fetch('https://sua-api.com/api/v1/livros/1/avaliacoes/')
  .then(response => response.json())
  .then(data => {
    console.log('Avaliações:', data);
    // Cada avaliação terá: id, texto, nota, curtidas, usuario_nome, etc.
  });
```

### 2. **Criar nova avaliação**
```javascript
// POST /api/v1/livros/1/avaliacoes/
fetch('https://sua-api.com/api/v1/livros/1/avaliacoes/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu_token_jwt'
  },
  body: JSON.stringify({
    texto: "Livro excelente! Recomendo muito."
  })
})
.then(response => response.json())
.then(data => console.log('Avaliação criada:', data));
```

### 3. **Curtir uma avaliação**
```javascript
// POST /api/v1/avaliacoes/123/curtir/
fetch('https://sua-api.com/api/v1/avaliacoes/123/curtir/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu_token_jwt'
  }
})
.then(response => response.json())
.then(data => console.log(data.detail)); // "Avaliação curtida com sucesso"
```

### 4. **Obter estatísticas do livro**
```javascript
// GET /api/v1/livros/1/estatisticas/
fetch('https://sua-api.com/api/v1/livros/1/estatisticas/')
  .then(response => response.json())
  .then(data => {
    console.log('Total de avaliações:', data.total_avaliacoes);
    console.log('Avaliações recentes:', data.avaliacoes_recentes);
  });
```

## 📝 Formato dos Dados

### **Avaliação (Response)**
```json
{
  "id": 1,
  "texto": "Livro muito bom!",
  "curtidas": 12,
  "data_publicacao": "2025-07-26T10:30:00Z",
  "usuario_nome": "João Silva",
  "usuario_id": 123,
  "usuario_username": "joao123",
  "livro": 1,
  "livro_titulo": "Dom Casmurro",
  "pode_curtir": true,
  "usuario_curtiu": false
}
```

### **Criar Avaliação (Request)**
```json
{
  "texto": "Texto da avaliação (mínimo 10 caracteres)"
}
```

### **Estatísticas do Livro**
```json
{
  "total_avaliacoes": 25,
  "avaliacoes_recentes": [
    // Array com as 5 avaliações mais recentes
  ]
}
```

## 🔒 Autenticação

Para endpoints que requerem autenticação, use JWT:

```javascript
headers: {
  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
}
```

## ⚠️ Regras de Negócio

- ✅ **Um usuário só pode avaliar um livro uma vez**
- ✅ **Usuário não pode curtir própria avaliação**
- ✅ **Texto mínimo de 10 caracteres**
- ✅ **Apenas o autor pode editar/excluir sua avaliação**

## 🎨 Componente React Exemplo

```jsx
function AvaliacoesLivro({ livroId }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({ texto: '', nota: 5 });

  useEffect(() => {
    // Carregar avaliações
    fetch(`/api/v1/livros/${livroId}/avaliacoes/`)
      .then(res => res.json())
      .then(setAvaliacoes);
  }, [livroId]);

  const criarAvaliacao = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/v1/livros/${livroId}/avaliacoes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(novaAvaliacao)
    });

    if (response.ok) {
      const avaliacao = await response.json();
      setAvaliacoes([avaliacao, ...avaliacoes]);
      setNovaAvaliacao({ texto: '', nota: 5 });
    }
  };

  const curtirAvaliacao = async (avaliacaoId) => {
    await fetch(`/api/v1/avaliacoes/${avaliacaoId}/curtir/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Recarregar avaliações...
  };

  return (
    <div>
      {/* Formulário para nova avaliação */}
      <form onSubmit={criarAvaliacao}>
        <textarea 
          value={novaAvaliacao.texto}
          onChange={(e) => setNovaAvaliacao({...novaAvaliacao, texto: e.target.value})}
          placeholder="Sua avaliação..."
        />
        <select 
          value={novaAvaliacao.nota}
          onChange={(e) => setNovaAvaliacao({...novaAvaliacao, nota: parseInt(e.target.value)})}
        >
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrela{n>1?'s':''}</option>)}
        </select>
        <button type="submit">Avaliar</button>
      </form>

      {/* Lista de avaliações */}
      {avaliacoes.map(avaliacao => (
        <div key={avaliacao.id}>
          <h4>{avaliacao.usuario_nome}</h4>
          <p>{avaliacao.estrelas_display}</p>
          <p>{avaliacao.texto}</p>
          <button onClick={() => curtirAvaliacao(avaliacao.id)}>
            ❤️ {avaliacao.curtidas}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Próximos Passos

1. **Executar migrações**: `python manage.py makemigrations && python manage.py migrate`
2. **Testar endpoints** no Postman/Insomnia
3. **Integrar no frontend** React
4. **Adicionar validações extras** se necessário

✨ **A API está pronta para uso!**
