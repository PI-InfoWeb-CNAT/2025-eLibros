#!/bin/bash

echo "🧹 Limpando dados de autenticação inválidos..."

# Verificar se o frontend está rodando
FRONTEND_URL="https://bug-free-train-qr595jrgp59fx76g-3000.app.github.dev"
BACKEND_URL="https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev"

echo "🔍 Verificando conexão com backend..."
if curl -f -s "$BACKEND_URL/api/v1/" > /dev/null; then
    echo "✅ Backend está respondendo"
else
    echo "❌ Backend não está respondendo em $BACKEND_URL"
    echo "🚀 Iniciando backend..."
    cd /workspaces/2025-eLibros/eLibros && python manage.py runserver 0.0.0.0:8000 &
    echo "⏳ Aguardando backend inicializar..."
    sleep 10
fi

echo "🔍 Verificando conexão com frontend..."
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend está respondendo"
else
    echo "❌ Frontend não está respondendo"
    echo "🚀 Iniciando frontend..."
    cd /workspaces/2025-eLibros/elibros-frontend && npm run dev &
    echo "⏳ Aguardando frontend inicializar..."
    sleep 15
fi

echo "🔧 Limpando localStorage (simulado)..."
echo "
// Script para executar no console do navegador
console.log('🧹 Limpando dados de autenticação...');
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('user');
console.log('✅ Dados limpos! Recarregue a página.');
"

echo "
✅ Script executado!

🌐 URLs da aplicação:
Frontend: $FRONTEND_URL
Backend: $BACKEND_URL

🔧 Para limpar dados de autenticação no navegador:
1. Abra o console do navegador (F12)
2. Execute:
   localStorage.removeItem('access_token');
   localStorage.removeItem('refresh_token');
   localStorage.removeItem('user');
   location.reload();

🐛 Para debug de tokens:
- Verifique se o backend está rodando
- Teste login com um usuário válido
- Verifique os logs do console do navegador
"