# Resumo das Alterações - Integração ImageKit.io

## ✅ Arquivos Criados

1. **`/utils/imagekit_config.py`**
   - Configuração do cliente ImageKit
   - Funções para upload, delete e geração de URLs
   - Lazy initialization para evitar erros quando variáveis não estão definidas

2. **`/utils/imagekit_serializers.py`**
   - `ImageKitUploadMixin`: Mixin para serializers com upload
   - `ImageKitImageField`: Campo customizado para imagens

3. **`/docs/IMAGEKIT_SETUP.md`**
   - Documentação completa de uso
   - Exemplos de código
   - Troubleshooting

## 📝 Arquivos Modificados

### Modelos

1. **`accounts/models.py` (Usuario)**
   - ❌ Removido: `foto_de_perfil` (ImageField)
   - ✅ Adicionado: `foto_de_perfil_url` (URLField)
   - ✅ Adicionado: `foto_de_perfil_file_id` (CharField)
   - 🔧 Atualizado: `perfil_preview()` para usar URL

2. **`elibrosLoja/models/livro.py` (Livro)**
   - ❌ Removido: `capa` (ImageField)
   - ✅ Adicionado: `capa_url` (URLField)
   - ✅ Adicionado: `capa_file_id` (CharField)
   - 🔧 Atualizado: `img_preview()` para usar URL

### Serializers

3. **`elibrosLoja/serializers.py`**
   - 🔧 Importações: Adicionadas funções do ImageKit
   - 🔧 `LivroSerializer`: Atualizado para retornar `capa_url`
   - ✅ `LivroCreateSerializer`: Agora herda de `ImageKitUploadMixin` e faz upload automático
   - 🔧 `UsuarioSerializer`: Adicionado campo `foto_de_perfil_url`
   - ✅ `UsuarioUpdateSerializer`: Novo serializer com upload de foto

### Views

4. **`elibrosLoja/views/UsuarioViewSet.py`**
   - 📦 Importado: `UsuarioUpdateSerializer`
   - 🔧 `get_serializer_class()`: Usa `UsuarioUpdateSerializer` para update/partial_update
   - ✅ **Novo endpoint**: `upload_foto_perfil()` - POST /api/v1/usuarios/upload_foto_perfil/

5. **`elibrosLoja/views/LivroViewSet.py`**
   - ✅ **Novo endpoint**: `upload_capa()` - POST /api/v1/livros/{id}/upload_capa/

### Forms (Django Admin)

6. **`accounts/forms/CustomUserChangeForm.py`**
   - 🔧 Campo: `foto_de_perfil` → `foto_de_perfil_url`

7. **`accounts/forms/CustomUserCreationForm.py`**
   - 🔧 Campo: `foto_de_perfil` → `foto_de_perfil_url`

### Dependências

8. **`requirements.txt`**
   - ✅ Adicionado: `imagekitio`

## 🗄️ Migrações Criadas

1. **`accounts/migrations/0010_remove_usuario_foto_de_perfil_and_more.py`**
   - Remove campo ImageField antigo
   - Adiciona campos URL e file_id

2. **`elibrosLoja/migrations/0044_remove_historicallivro_capa_remove_livro_capa_and_more.py`**
   - Remove campo ImageField antigo
   - Adiciona campos URL e file_id
   - Atualiza também o modelo de histórico

## 🔧 Variáveis de Ambiente Necessárias

```bash
IMAGEKIT_ID=seu_imagekit_id_aqui
IMAGEKIT_PRIVATE_KEY=sua_chave_privada_aqui
```

A chave pública já está hardcoded: `public_Iq6eqMKcdckCLNSaXJOegCGbJwQ=`

## 📡 Novos Endpoints da API

### 1. Upload de Foto de Perfil
```
POST /api/v1/usuarios/upload_foto_perfil/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  foto_de_perfil: [arquivo]
```

### 2. Upload de Capa de Livro
```
POST /api/v1/livros/{id}/upload_capa/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  capa: [arquivo]
```

### 3. Criar Livro com Capa
```
POST /api/v1/livros/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  titulo: "Nome"
  ISBN: "1234567890123"
  preco: 29.90
  quantidade: 100
  capa: [arquivo]
  ... outros campos
```

### 4. Atualizar Usuário com Foto
```
PATCH /api/v1/usuarios/{id}/
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  nome: "Nome"
  foto_de_perfil: [arquivo]
  ... outros campos
```

## 🎯 Funcionalidades Implementadas

✅ Upload automático para ImageKit.io  
✅ Deleção automática de imagens antigas ao fazer upload de novas  
✅ Nomes de arquivo únicos gerados automaticamente  
✅ Organização por pastas (`/livros/`, `/perfis/`)  
✅ Tags automáticas para organização  
✅ Fallback gracioso quando ImageKit não está configurado  
✅ Serializers com suporte a upload direto  
✅ Endpoints dedicados para upload de imagens  
✅ Documentação completa  

## 🚀 Como Testar

### 1. No Postman/Insomnia:

**Upload de Foto de Perfil:**
```
POST https://seu-dominio.com/api/v1/usuarios/upload_foto_perfil/
Headers:
  Authorization: Bearer {seu_token_jwt}
Body (form-data):
  foto_de_perfil: [selecionar arquivo]
```

**Upload de Capa:**
```
POST https://seu-dominio.com/api/v1/livros/1/upload_capa/
Headers:
  Authorization: Bearer {seu_token_jwt}
Body (form-data):
  capa: [selecionar arquivo]
```

### 2. No Frontend (Next.js):

```javascript
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
  
  return await response.json();
};
```

## ⚠️ Notas Importantes

1. **Migrações já aplicadas** ✅
2. **Sistema verifica automaticamente** se as variáveis de ambiente estão configuradas
3. **Sem variáveis configuradas**: O sistema continua funcionando, mas uploads não funcionarão
4. **Com variáveis configuradas**: Uploads automáticos para ImageKit.io

## 📦 Para Deploy no Render

Adicione as variáveis de ambiente no painel do Render:
- `IMAGEKIT_ID`
- `IMAGEKIT_PRIVATE_KEY`

As migrações serão aplicadas automaticamente no build.
