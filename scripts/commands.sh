#!/bin/sh

# O shell irá encerrar a execução do script quando um comando falhar
set -e

echo "🐍 Ativando ambiente virtual..."
source /workspaces/2025-eLibros/.venv/bin/activate

# Verificar se as dependências estão instaladas
if [ ! -f "/workspaces/2025-eLibros/.venv/installed" ]; then
    echo "📦 Instalando dependências..."
    pip install --upgrade pip
    pip install -r /workspaces/2025-eLibros/requirements.txt
    touch /workspaces/2025-eLibros/.venv/installed
    echo "✅ Dependências instaladas!"
fi

# Se usando PostgreSQL (container), aguardar conexão
if [ ! -z "$POSTGRES_HOST" ]; then
    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      echo "🟡 Waiting for Postgres Database Startup ($POSTGRES_HOST $POSTGRES_PORT) ..."
      sleep 2
    done
    echo "✅ Postgres Database Started Successfully ($POSTGRES_HOST:$POSTGRES_PORT)"
fi

echo "🔧 Executando migrações..."
#python manage.py collectstatic --noinput
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "🚀 Iniciando servidor Django..."
python manage.py runserver 0.0.0.0:8000