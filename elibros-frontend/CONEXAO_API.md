# Como Conectar a API Django com o Next.js no Codespaces

## 📋 Configuração Rápida

### 1. Configurar as URLs no `.env.local`

O arquivo `.env.local` já está configurado com a URL correta do Codespaces:

```bash
NEXT_PUBLIC_API_URL=https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/api/v1
```

### 2. Iniciar os Servidores

#### Django (Backend - Porta 8000):
```bash
cd /workspaces/2025-eLibros/eLibros
python manage.py runserver 0.0.0.0:8000
```

#### Next.js (Frontend - Porta 3000):
```bash
cd /workspaces/2025-eLibros/elibros-frontend
npm install
npm run dev
```

### 3. URLs de Acesso no Codespaces

- **Backend Django**: `https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev`
- **Frontend Next.js**: `https://bug-free-train-qr595jrgp59fx76g-3000.app.github.dev`
- **Admin Django**: `https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev/admin`

## 🔧 Arquivos de Configuração

### API Service (`src/services/api.ts`)
- Contém todas as funções para comunicação com a API Django
- Configurado para usar JWT authentication
- Tipos TypeScript já definidos

### Hooks React (`src/hooks/useApi.js`)
- Hooks personalizados para facilitar o uso da API
- `useLivros()`, `useLivrosDestaque()`, `useLancamentos()`
- Gerenciamento automático de loading e error states

### Componente de Exemplo (`src/components/ExemploAPI.jsx`)
- Demonstra como usar os hooks da API
- Mostra como fazer pesquisas
- Exibe status da conexão

## 🚀 Como Usar a API

### 1. Importar o serviço da API:
```javascript
import { apiService } from '../lib/api-example';
```

### 2. Usar hooks React:
```javascript
import { useLivros, useLivrosDestaque } from '../hooks/useApi';

function MeuComponente() {
  const { data: livros, loading, error } = useLivros();
  
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  
  return (
    <div>
      {livros?.results?.map(livro => (
        <div key={livro.id}>{livro.titulo}</div>
      ))}
    </div>
  );
}
```

### 3. Fazer requisições manuais:
```javascript
const fetchLivros = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/livros/`
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

## 📡 Endpoints Disponíveis

### Livros
- `GET /livros/` - Lista todos os livros
- `GET /livros/{id}/` - Detalhes de um livro
- `GET /livros/destaque/` - Livros em destaque
- `GET /livros/lancamentos/` - Lançamentos
- `GET /livros/?search=termo` - Pesquisar livros

### Autenticação
- `POST /auth/login/` - Login
- `POST /auth/refresh/` - Renovar token
- `POST /auth/logout/` - Logout

### Carrinho
- `GET /carrinho/` - Ver carrinho
- `POST /carrinho/adicionar/` - Adicionar item
- `PUT /carrinho/atualizar/{id}/` - Atualizar item
- `DELETE /carrinho/remover/{id}/` - Remover item

## 🔍 Teste da Conexão

Execute o script de teste para verificar se a API está funcionando:

```bash
cd /workspaces/2025-eLibros/elibros-frontend
node test-api.js
```

## ⚙️ Configurações do Django

O Django já está configurado para aceitar requisições do Codespaces:

- CORS configurado para permitir o frontend
- `ALLOWED_HOSTS = ["*"]` para aceitar qualquer host
- URLs da API em `/api/v1/`

## 🔐 Autenticação JWT

Para endpoints que requerem autenticação:

```javascript
// Fazer login primeiro
const login = await apiService.login(email, senha);
localStorage.setItem('access_token', login.access);

// Usar token nas requisições seguintes
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json',
};
```

## 🐛 Troubleshooting

1. **Erro de CORS**: Verifique se o Django está rodando e as configurações de CORS estão corretas
2. **404 na API**: Confirme se a URL no `.env.local` está correta
3. **Connection refused**: Verifique se o servidor Django está rodando na porta 8000

## 📝 Próximos Passos

1. Personalizar os componentes para suas necessidades
2. Implementar autenticação completa
3. Adicionar gerenciamento de estado (Context API ou Redux)
4. Implementar cache de dados
5. Adicionar tratamento de erros mais robusto