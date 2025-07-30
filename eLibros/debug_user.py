#!/usr/bin/env python
import os
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elibrosAdmin.settings')
django.setup()

from accounts.models import Usuario

# Verificar token antes
user = Usuario.objects.filter(email='souza.cortez.013@gmail.com').first()
print(f'Token antes do reset: {user.login_token if user else "Usuario não encontrado"}')

# 1. Primeiro fazer reset de senha
print('\n🔄 Fazendo reset de senha...')
reset_url = 'http://localhost:8000/api/v1/usuarios/reset_password/'
reset_data = {"email": "souza.cortez.013@gmail.com"}

reset_response = requests.post(reset_url, json=reset_data)
print(f'Reset Status: {reset_response.status_code}')
print(f'Reset Response: {reset_response.text}')

# 2. Verificar token logo após o reset
user = Usuario.objects.filter(email='souza.cortez.013@gmail.com').first()
if user:
    print(f'Token imediatamente após reset: {user.login_token}')
    
    if user.login_token:
        # 3. Testar confirmação com o token atual
        print(f'\n✅ Testando confirmação com token: {user.login_token}')
        
        confirm_url = 'http://localhost:8000/api/v1/usuarios/password_reset_confirmation/'
        confirm_data = {
            "email": "souza.cortez.013@gmail.com",
            "otp": user.login_token,
            "new_password": "novaSenha123456",
            "confirm_password": "novaSenha123456"
        }
        
        confirm_response = requests.post(confirm_url, json=confirm_data)
        print(f'Confirmação Status: {confirm_response.status_code}')
        print(f'Confirmação Response: {confirm_response.text}')
        
        if confirm_response.status_code == 200:
            print('🎉 Reset de senha funcionou!')
        else:
            print('❌ Erro na confirmação')
    else:
        print('❌ Token não foi gerado no reset')
else:
    print('❌ Usuário não encontrado')
