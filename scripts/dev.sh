#!/bin/bash

# Script para desenvolvimento - ativa venv e roda o servidor
# Uso: ./scripts/dev.sh

echo "🛠️  Modo Desenvolvimento - eLibros API"
echo "======================================"

# Ativar ambiente virtual
source /workspaces/2025-eLibros/.venv/bin/activate

# Ir para o diretório do Django
cd /workspaces/2025-eLibros/eLibros

echo "🔧 Verificando migrações..."
python manage.py makemigrations

echo "🔧 Aplicando migrações..."
python manage.py migrate

echo "🚀 Iniciando servidor de desenvolvimento..."
echo "💡 API disponível em: http://localhost:8000/api/v1/"
echo "📖 Admin em: http://localhost:8000/djangoadmin/"
echo ""
echo "🛑 Pressione Ctrl+C para parar"

python manage.py runserver 0.0.0.0:8000
