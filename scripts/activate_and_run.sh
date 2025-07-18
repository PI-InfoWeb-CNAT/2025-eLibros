#!/bin/bash

# Script para ativar o ambiente virtual e executar comandos Django
# Uso: ./scripts/activate_and_run.sh [comando]

echo "🐍 Ativando ambiente virtual Python..."

# Verificar se o ambiente virtual existe
if [ ! -d "/workspaces/2025-eLibros/.venv" ]; then
    echo "❌ Ambiente virtual não encontrado!"
    echo "🔧 Criando ambiente virtual..."
    python3 -m venv /workspaces/2025-eLibros/.venv
    echo "✅ Ambiente virtual criado!"
fi

# Ativar o ambiente virtual
source /workspaces/2025-eLibros/.venv/bin/activate

echo "✅ Ambiente virtual ativado!"
echo "📦 Versão do Python: $(python --version)"
echo "📍 Localização do Python: $(which python)"

# Instalar dependências se não estiverem instaladas
if [ ! -f "/workspaces/2025-eLibros/.venv/installed" ]; then
    echo "📦 Instalando dependências..."
    pip install --upgrade pip
    pip install -r /workspaces/2025-eLibros/requirements.txt
    touch /workspaces/2025-eLibros/.venv/installed
    echo "✅ Dependências instaladas!"
fi

# Se um comando foi passado como argumento, executá-lo
if [ $# -gt 0 ]; then
    echo "🚀 Executando: $@"
    cd /workspaces/2025-eLibros/eLibros
    "$@"
else
    echo "🎯 Ambiente pronto! Use:"
    echo "  cd /workspaces/2025-eLibros/eLibros"
    echo "  python manage.py runserver"
    echo ""
    echo "💡 Ou execute diretamente:"
    echo "  ./scripts/activate_and_run.sh python manage.py runserver"
fi
