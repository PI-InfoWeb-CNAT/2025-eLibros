#!/bin/bash

# Script para instalar dependências no ambiente virtual
# Uso: ./scripts/install.sh

echo "📦 Instalando dependências do eLibros..."
echo "======================================"

# Verificar se o ambiente virtual existe
if [ ! -d "/workspaces/2025-eLibros/.venv" ]; then
    echo "❌ Ambiente virtual não encontrado!"
    echo "🔧 Criando ambiente virtual..."
    python3 -m venv /workspaces/2025-eLibros/.venv
    echo "✅ Ambiente virtual criado!"
fi

# Ativar ambiente virtual
source /workspaces/2025-eLibros/.venv/bin/activate

echo "🐍 Python ativo: $(which python)"
echo "📦 Versão do Python: $(python --version)"

# Atualizar pip
echo "⬆️ Atualizando pip..."
pip install --upgrade pip

# Instalar dependências
echo "📦 Instalando dependências do requirements.txt..."
pip install -r /workspaces/2025-eLibros/requirements.txt

# Marcar como instalado
touch /workspaces/2025-eLibros/.venv/installed

echo ""
echo "✅ Instalação concluída!"
echo "🎯 Agora você pode executar:"
echo "   ./scripts/dev.sh        # Para rodar o servidor"
echo "   ./scripts/test_api.sh   # Para testar a API"
