# Scripts do eLibros 📜

Este diretório contém scripts para facilitar o desenvolvimento e execução do projeto eLibros.

## 🚀 Scripts Disponíveis

### `./scripts/install.sh`
**Instala todas as dependências no ambiente virtual**
```bash
./scripts/install.sh
```
- Cria o ambiente virtual se não existir
- Ativa o ambiente virtual
- Instala todas as dependências do `requirements.txt`
- Atualiza o pip

### `./scripts/dev.sh`
**Executa o servidor de desenvolvimento**
```bash
./scripts/dev.sh
```
- Ativa o ambiente virtual automaticamente
- Executa migrações se necessário
- Inicia o servidor Django em modo desenvolvimento
- API disponível em: `http://localhost:8000/api/v1/`

### `./scripts/activate_and_run.sh [comando]`
**Ativa o ambiente virtual e executa um comando**
```bash
# Apenas ativar o ambiente
./scripts/activate_and_run.sh

# Executar um comando específico
./scripts/activate_and_run.sh python manage.py shell
./scripts/activate_and_run.sh python manage.py createsuperuser
```

### `./scripts/commands.sh`
**Script para produção/container**
- Usado principalmente em containers Docker
- Aguarda banco PostgreSQL se necessário
- Executa migrações e inicia servidor

## 🧪 Teste da API

### `./test_api.sh`
**Testa os endpoints da API**
```bash
./test_api.sh
```
- Verifica se o servidor está rodando
- Testa endpoints públicos da API
- Mostra exemplos de uso

## 🔧 Como usar

### 1. Primeira execução:
```bash
# 1. Instalar dependências
./scripts/install.sh

# 2. Executar servidor
./scripts/dev.sh
```

### 2. Desenvolvimento diário:
```bash
# Apenas executar o servidor (se já instalou antes)
./scripts/dev.sh
```

### 3. Comandos Django específicos:
```bash
# Criar superusuário
./scripts/activate_and_run.sh python manage.py createsuperuser

# Abrir shell do Django
./scripts/activate_and_run.sh python manage.py shell

# Executar testes
./scripts/activate_and_run.sh python manage.py test
```

### 4. Testar API:
```bash
# Em outro terminal, enquanto o servidor roda
./test_api.sh
```

## 🐍 Ambiente Virtual

O ambiente virtual fica em `/workspaces/2025-eLibros/.venv/`

### Ativar manualmente:
```bash
source .venv/bin/activate
```

### Desativar:
```bash
deactivate
```

## 📝 Notas

- Todos os scripts ativam o ambiente virtual automaticamente
- As dependências são instaladas apenas uma vez (arquivo `.venv/installed`)
- Os scripts são seguros para executar múltiplas vezes
- Use `Ctrl+C` para parar o servidor de desenvolvimento
