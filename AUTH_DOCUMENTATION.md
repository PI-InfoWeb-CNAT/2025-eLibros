# Documentação da Autenticação JWT - eLibros API

## 📋 **Problemas Corrigidos**

### **1. Problemas Principais Identificados:**
- ❌ URL hardcoded incorreta no reset de senha
- ❌ Mistura de conceitos REST/Web (usando `request.POST` em API)
- ❌ Falta de validação de token OTP
- ❌ Router conflitante com endpoints JWT
- ❌ Serializers com campos incorretos
- ❌ Falta de blacklist de tokens para segurança

### **2. Soluções Implementadas:**
- ✅ **JWT Customizado**: Implementação completa usando `rest_framework_simplejwt`
- ✅ **Token Blacklist**: Segurança aprimorada com invalidação de tokens
- ✅ **Serializers Corretos**: Campos alinhados com o modelo `Usuario`
- ✅ **URLs Dinâmicas**: Construção automática baseada no ambiente
- ✅ **Validação OTP**: Sistema completo de reset de senha
- ✅ **Login por Email**: Autenticação usando email em vez de username

## 🔐 **Endpoints de Autenticação**

### **1. Login (JWT Prioritário)**
```http
POST /api/auth/login/
Content-Type: application/json

{
    "email": "usuario@exemplo.com",
    "password": "senha123"
}
```

**Resposta:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "usuario@exemplo.com",
        "nome": "Nome do Usuário",
        "username": "username",
        "is_verified": true
    }
}
```

### **2. Refresh Token**
```http
POST /api/auth/refresh/
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### **3. Verificar Token**
```http
POST /api/auth/verify/
Content-Type: application/json

{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### **4. Criar Conta**
```http
POST /api/usuarios/
Content-Type: application/json

{
    "email": "novo@exemplo.com",
    "username": "novousuario",
    "nome": "Nome Completo",
    "CPF": "123.456.789-00",
    "telefone": "(11) 99999-9999",
    "password": "senha123",
    "password_confirm": "senha123"
}
```

### **5. Logout**
```http
POST /api/usuarios/logout/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### **6. Solicitar Reset de Senha**
```http
POST /api/usuarios/reset_password/
Content-Type: application/json

{
    "email": "usuario@exemplo.com"
}
```

### **7. Confirmar Reset de Senha**
```http
POST /api/usuarios/password_reset_confirmation/
Content-Type: application/json

{
    "email": "usuario@exemplo.com",
    "otp": "123456",
    "new_password": "novaSenha123",
    "confirm_password": "novaSenha123"
}
```

## 🛡️ **Configurações de Segurança**

### **JWT Settings Configuradas:**
- **Access Token**: 60 minutos
- **Refresh Token**: 7 dias
- **Rotação Automática**: Ativada
- **Blacklist**: Tokens antigos invalidados
- **Algoritmo**: HS256
- **Claims Customizados**: email, nome, is_verified

### **Headers de Autenticação:**
```http
Authorization: Bearer <access_token>
```

## 📱 **Uso no Frontend**

### **1. Login**
```javascript
const login = async (email, password) => {
    const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Armazenar tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
};
```

### **2. Requisições Autenticadas**
```javascript
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
};
```

### **3. Refresh Automático**
```javascript
const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    
    const response = await fetch('/api/auth/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh })
    });
    
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
    } else {
        // Redirect para login
        window.location.href = '/login';
    }
};
```

## 🔄 **Fluxo de Reset de Senha**

1. **Frontend**: Usuário informa email
2. **API**: Gera OTP e envia email
3. **Frontend**: Usuário recebe email com código/link
4. **Frontend**: Formulário com OTP + nova senha
5. **API**: Valida OTP e atualiza senha
6. **Frontend**: Login automático com novos tokens

## ⚡ **Vantagens da Implementação**

- **Segurança**: Blacklist de tokens, rotação automática
- **Flexibilidade**: Login por email, claims customizados
- **Performance**: Tokens JWT stateless
- **UX**: Login automático após reset de senha
- **Compatibilidade**: Funciona com React/Next.js
- **Padrões**: Segue melhores práticas REST
