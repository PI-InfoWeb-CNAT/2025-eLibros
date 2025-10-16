# Documentação da API - Swagger/OpenAPI

## Visão Geral

A API do eLibros está documentada usando **drf-spectacular**, que gera automaticamente a documentação OpenAPI 3.0 (Swagger).

## Acessar a Documentação

### Swagger UI (Interface Interativa)
```
http://localhost:8000/api/v1/docs/
```
ou em produção:
```
https://two025-elibros.onrender.com/api/v1/docs/
```

### ReDoc (Documentação Alternativa)
```
http://localhost:8000/api/v1/redoc/
```

### Schema OpenAPI (JSON)
```
http://localhost:8000/api/v1/schema/
```

## Recursos da Documentação

### ✅ Swagger UI Features

- **Try It Out**: Teste os endpoints diretamente na interface
- **Autenticação JWT**: Configure o Bearer token uma vez e use em todas as requisições
- **Exemplos de Request/Response**: Veja exemplos de dados para cada endpoint
- **Filtros e Buscas**: Interface para testar filtros e parâmetros de busca
- **Download do Schema**: Baixe o schema OpenAPI completo

## Autenticação no Swagger

### Passo 1: Obter Token
1. Vá para o endpoint `POST /api/v1/auth/login/`
2. Clique em "Try it out"
3. Preencha:
   ```json
   {
     "email": "seu@email.com",
     "password": "sua_senha"
   }
   ```
4. Clique em "Execute"
5. Copie o `access` token da resposta

### Passo 2: Autenticar
1. Clique no botão "Authorize" (🔒) no topo da página
2. Cole o token no campo `bearerAuth (http, Bearer)`
3. Clique em "Authorize" e depois "Close"

Agora todos os endpoints protegidos estarão acessíveis!

## Estrutura da API

### 📚 Endpoints Principais

#### Autenticação
- `POST /api/v1/auth/login/` - Login e obtenção de tokens
- `POST /api/v1/auth/refresh/` - Renovar access token
- `POST /api/v1/auth/verify/` - Verificar validade do token
- `POST /api/v1/usuarios/logout/` - Logout (blacklist token)
- `POST /api/v1/usuarios/reset_password/` - Solicitar reset de senha
- `POST /api/v1/usuarios/password_reset_confirmation/` - Confirmar reset

#### Livros
- `GET /api/v1/livros/` - Listar livros (com paginação)
- `GET /api/v1/livros/{id}/` - Detalhes de um livro
- `POST /api/v1/livros/` - Criar livro (admin)
- `PUT /api/v1/livros/{id}/` - Atualizar livro (admin)
- `DELETE /api/v1/livros/{id}/` - Deletar livro (admin)
- `GET /api/v1/livros/explorar/` - Buscar e filtrar livros
- `GET /api/v1/livros/acervo/` - Livros organizados por categoria
- `GET /api/v1/livros/destaque/` - Livros em destaque
- `GET /api/v1/livros/lancamentos/` - Últimos lançamentos
- `POST /api/v1/livros/{id}/upload_capa/` - Upload de capa

#### Usuários
- `POST /api/v1/usuarios/` - Criar conta
- `GET /api/v1/usuarios/` - Listar usuários (admin)
- `GET /api/v1/usuarios/{id}/` - Detalhes do usuário
- `PUT /api/v1/usuarios/{id}/` - Atualizar usuário
- `DELETE /api/v1/usuarios/{id}/` - Deletar usuário
- `POST /api/v1/usuarios/upload_foto_perfil/` - Upload de foto

#### Outros Recursos
- Autores: `/api/v1/autores/`
- Categorias: `/api/v1/categorias/`
- Gêneros: `/api/v1/generos/`
- Clientes: `/api/v1/cliente/`
- Carrinhos: `/api/v1/carrinhos/`
- Pedidos: `/api/v1/pedidos/`
- Avaliações: `/api/v1/avaliacoes/`
- Cupons: `/api/v1/cupons/`
- Admin: `/api/v1/admin/`

## Filtros e Paginação

### Paginação
Todos os endpoints de listagem suportam paginação:
```
GET /api/v1/livros/?page=2
```

Resposta:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/v1/livros/?page=3",
  "previous": "http://localhost:8000/api/v1/livros/?page=1",
  "results": [...]
}
```

### Filtros (Livros)
```
GET /api/v1/livros/?categoria=1&genero=2&autor=3
```

### Busca
```
GET /api/v1/livros/?search=Dom+Casmurro
```

### Ordenação
```
GET /api/v1/livros/?ordering=-preco
```

## Testando Uploads

### Upload de Capa de Livro

No Swagger UI:
1. Vá para `POST /api/v1/livros/{id}/upload_capa/`
2. Clique em "Try it out"
3. Insira o ID do livro
4. Clique em "Choose File" e selecione a imagem
5. Execute

### Upload de Foto de Perfil

No Swagger UI:
1. Vá para `POST /api/v1/usuarios/upload_foto_perfil/`
2. Clique em "Try it out"
3. Clique em "Choose File" e selecione a imagem
4. Execute

## Schemas e Validação

Todos os endpoints têm:
- **Schemas de Request**: Mostra quais campos são obrigatórios/opcionais
- **Schemas de Response**: Mostra a estrutura da resposta
- **Validações**: Lista regras de validação para cada campo
- **Exemplos**: Exemplos de dados válidos

## Códigos de Status HTTP

- `200 OK` - Sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem conteúdo na resposta
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

## Desenvolvimento

### Adicionar Tags a um Endpoint

```python
from drf_spectacular.utils import extend_schema

@extend_schema(
    tags=['Nome da Tag'],
    summary='Resumo curto',
    description='Descrição detalhada',
)
@api_view(['GET'])
def meu_endpoint(request):
    pass
```

### Documentar um ViewSet

```python
from drf_spectacular.utils import extend_schema_view, extend_schema

@extend_schema_view(
    list=extend_schema(tags=['Minha Tag'], summary='Listar'),
    retrieve=extend_schema(tags=['Minha Tag'], summary='Detalhe'),
)
class MeuViewSet(viewsets.ModelViewSet):
    pass
```

### Parâmetros de Query

```python
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.types import OpenApiTypes

@extend_schema(
    parameters=[
        OpenApiParameter(
            name='busca',
            type=OpenApiTypes.STR,
            description='Termo de busca'
        ),
    ]
)
```

## Troubleshooting

### Schema não atualiza
Execute:
```bash
python manage.py spectacular --file schema.yml
```

### Erro de importação
Certifique-se de que `drf-spectacular` está instalado:
```bash
pip install drf-spectacular
```

### Endpoints não aparecem
Verifique se o ViewSet está registrado no router em `api_urls.py`

## Exportar Schema

```bash
# YAML
python manage.py spectacular --file schema.yml

# JSON
python manage.py spectacular --format openapi-json --file schema.json
```

## Links Úteis

- [Documentação drf-spectacular](https://drf-spectacular.readthedocs.io/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
