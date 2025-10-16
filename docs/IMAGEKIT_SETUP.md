# Configuração do ImageKit.io

## Visão Geral

Este projeto usa o ImageKit.io para armazenamento e gerenciamento de imagens (capas de livros e fotos de perfil).

## Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```bash
IMAGEKIT_ID=seu_imagekit_id
IMAGEKIT_PRIVATE_KEY=sua_chave_privada
```

A chave pública já está configurada no código: `public_Iq6eqMKcdckCLNSaXJOegCGbJwQ=`

## Modelos Atualizados

### Usuario (accounts/models.py)
- `foto_de_perfil_url`: URL da foto armazenada no ImageKit
- `foto_de_perfil_file_id`: ID do arquivo no ImageKit (para deletar)

### Livro (elibrosLoja/models/livro.py)
- `capa_url`: URL da capa armazenada no ImageKit
- `capa_file_id`: ID do arquivo no ImageKit (para deletar)

## Endpoints de Upload

### Upload de Foto de Perfil

```http
POST /api/v1/usuarios/upload_foto_perfil/
Authorization: Bearer {token}
Content-Type: multipart/form-data

foto_de_perfil: [arquivo de imagem]
```

**Resposta de Sucesso:**
```json
{
  "message": "Foto de perfil atualizada com sucesso.",
  "foto_url": "https://ik.imagekit.io/seu_id/perfis/nome_arquivo.jpg"
}
```

### Upload de Capa de Livro

```http
POST /api/v1/livros/{id}/upload_capa/
Authorization: Bearer {token}
Content-Type: multipart/form-data

capa: [arquivo de imagem]
```

**Resposta de Sucesso:**
```json
{
  "message": "Capa do livro atualizada com sucesso.",
  "capa_url": "https://ik.imagekit.io/seu_id/livros/nome_arquivo.jpg"
}
```

## Serializers com Upload

### Criar/Atualizar Livro com Capa

```python
# LivroCreateSerializer aceita upload direto
POST /api/v1/livros/
Content-Type: multipart/form-data

titulo: "Nome do Livro"
autor: [1, 2]
ISBN: "1234567890123"
preco: 29.90
quantidade: 100
capa: [arquivo de imagem]
# ... outros campos
```

### Atualizar Usuário com Foto

```python
# UsuarioUpdateSerializer aceita upload direto
PATCH /api/v1/usuarios/{id}/
Content-Type: multipart/form-data

nome: "João Silva"
telefone: "(11) 98765-4321"
foto_de_perfil: [arquivo de imagem]
# ... outros campos
```

## Organização de Pastas no ImageKit

- `/perfis/` - Fotos de perfil dos usuários
- `/livros/` - Capas dos livros

## Tags

As imagens são automaticamente tagueadas:

**Perfis:**
- `perfil`
- `user_{id}`

**Livros:**
- `capa`
- `livro_{id}`
- `{ISBN}`

## Funcionalidades Automáticas

1. **Upload**: Ao fazer upload de uma nova imagem, a antiga é automaticamente deletada
2. **Unique Filenames**: Nomes de arquivo únicos são gerados automaticamente
3. **Fallback**: Se as variáveis de ambiente não estiverem configuradas, o sistema continua funcionando (sem uploads)

## Exemplo de Uso no Frontend (Next.js)

```javascript
// Upload de foto de perfil
const uploadFoto = async (file) => {
  const formData = new FormData();
  formData.append('foto_de_perfil', file);
  
  const response = await fetch('/api/v1/usuarios/upload_foto_perfil/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  });
  
  const data = await response.json();
  return data.foto_url;
};

// Upload de capa de livro
const uploadCapa = async (livroId, file) => {
  const formData = new FormData();
  formData.append('capa', file);
  
  const response = await fetch(`/api/v1/livros/${livroId}/upload_capa/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  });
  
  const data = await response.json();
  return data.capa_url;
};
```

## Transformações de Imagem

O ImageKit permite transformações na URL:

```javascript
// Exemplo: redimensionar imagem
const thumbUrl = `${foto_url}?tr=w-200,h-200,fo-auto`;

// Exemplo: crop circular
const avatarUrl = `${foto_url}?tr=w-100,h-100,r-max`;
```

## Troubleshooting

### Erro: "ImageKit não configurado"

Certifique-se de que as variáveis de ambiente `IMAGEKIT_ID` e `IMAGEKIT_PRIVATE_KEY` estão definidas.

### Upload falha silenciosamente

Verifique os logs do servidor. O erro será impresso no console.

### Imagem não aparece

Verifique se a URL retornada está correta e se o arquivo foi realmente enviado ao ImageKit verificando no dashboard.
