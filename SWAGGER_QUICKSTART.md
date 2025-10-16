# 🚀 Quick Start - Swagger API Documentation

## Acesso Rápido

### Swagger UI (Recomendado)
```
http://localhost:8000/api/v1/docs/
```

### ReDoc (Alternativo)
```
http://localhost:8000/api/v1/redoc/
```

## 🔐 Como Autenticar (em 3 passos)

### 1️⃣ Fazer Login
- Vá para `POST /api/v1/auth/login/`
- Clique em **"Try it out"**
- Preencha:
  ```json
  {
    "email": "seu@email.com",
    "password": "sua_senha"
  }
  ```
- Clique em **"Execute"**
- **Copie** o token `access` da resposta

### 2️⃣ Configurar Token
- Clique no botão **🔒 Authorize** (topo da página)
- Cole o token no campo `bearerAuth`
- Clique em **"Authorize"**
- Clique em **"Close"**

### 3️⃣ Pronto!
Agora você pode testar todos os endpoints que requerem autenticação! 🎉

## 📱 Endpoints Principais

### Autenticação
- `POST /auth/login/` - Login
- `POST /auth/refresh/` - Refresh token
- `POST /usuarios/logout/` - Logout

### Livros
- `GET /livros/` - Listar todos
- `GET /livros/{id}/` - Ver detalhes
- `GET /livros/explorar/` - Buscar/filtrar
- `GET /livros/destaque/` - Destaques
- `POST /livros/{id}/upload_capa/` - Upload capa (🔒)

### Usuários
- `POST /usuarios/` - Criar conta
- `GET /usuarios/{id}/` - Ver perfil (🔒)
- `PATCH /usuarios/{id}/` - Atualizar (🔒)
- `POST /usuarios/upload_foto_perfil/` - Upload foto (🔒)

### Outros
- `GET /inicio/` - Página inicial
- `GET /estatisticas/` - Estatísticas
- `GET /carrinhos/` - Carrinhos (🔒)
- `GET /pedidos/` - Pedidos (🔒)

🔒 = Requer autenticação

## 💡 Dicas

### Testar um Endpoint
1. Escolha o endpoint
2. Clique em **"Try it out"**
3. Preencha os dados
4. Clique em **"Execute"**
5. Veja a resposta abaixo

### Upload de Arquivos
1. Clique em **"Try it out"**
2. Clique em **"Choose File"**
3. Selecione a imagem
4. **"Execute"**

### Filtrar Livros
```
GET /livros/?search=Dom+Casmurro
GET /livros/?categoria=1
GET /livros/?ordering=-preco
```

### Paginação
```
GET /livros/?page=2
```

## 🎨 Interface

- **Tags** - Endpoints organizados por categoria
- **Schemas** - Estrutura de dados de cada endpoint
- **Examples** - Exemplos de requisição/resposta
- **Models** - Definição de cada modelo

## 📖 Documentação Completa

Para mais detalhes, veja:
- `/docs/SWAGGER_SETUP.md` - Guia completo
- `/SWAGGER_CHANGES.md` - Resumo das implementações

## 🐛 Problemas?

### Token expirado?
Faça login novamente em `/auth/login/`

### Endpoint não aparece?
Recarregue a página (Ctrl+R)

### Erro 401?
Configure a autenticação (veja seção "Como Autenticar")

---

**Desenvolvido com ❤️ pela equipe eLibros**
