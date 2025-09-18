#!/bin/bash

# Script para reiniciar os servidores em desenvolvimento

echo "🔄 Reiniciando servidores..."

# Matar processos existentes nas portas 3000 e 8000
echo "📱 Parando processos nas portas 3000 e 8000..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "runserver" 2>/dev/null || true

# Aguardar um momento
sleep 2

# Iniciar Django
echo "🐍 Iniciando Django na porta 8000..."
cd /workspaces/2025-eLibros/eLibros && python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Aguardar Django inicializar
sleep 5

# Iniciar Next.js
echo "⚛️ Iniciando Next.js na porta 3000..."
cd /workspaces/2025-eLibros/elibros-frontend && npm run dev &
NEXTJS_PID=$!

echo "✅ Servidores iniciados!"
echo "🔗 URLs:"
echo "   Frontend: https://bug-free-train-qr595jrgp59fx76g-3000.app.github.dev"
echo "   Backend:  https://bug-free-train-qr595jrgp59fx76g-8000.app.github.dev"
echo ""
echo "📋 PIDs dos processos:"
echo "   Django: $DJANGO_PID"
echo "   Next.js: $NEXTJS_PID"
echo ""
echo "Para parar os servidores, use: kill $DJANGO_PID $NEXTJS_PID"

# Manter o script rodando
wait