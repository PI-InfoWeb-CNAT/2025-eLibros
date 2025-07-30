#!/usr/bin/env python
import os
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'elibrosAdmin.settings')
django.setup()

from accounts.models import Usuario

def test_password_reset_confirmation():
    """Testa a confirmação do reset de senha"""
    
    # Verificar token atual
    user = Usuario.objects.filter(email='souza.cortez.013@gmail.com').first()
    print(f"Token antes da confirmação: {user.login_token}")
    
    # Dados para o teste
    data = {
        "email": "souza.cortez.013@gmail.com",
        "otp": "816573",
        "new_password": "novaSenha123456",
        "confirm_password": "novaSenha123456"
    }
    
    # Fazer requisição
    url = "http://localhost:8000/api/v1/usuarios/password_reset_confirmation/"
    
    try:
        response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Reset de senha funcionou!")
            response_data = response.json()
            print(f"Dados retornados: {json.dumps(response_data, indent=2)}")
            
            # Verificar se o token foi limpo
            user.refresh_from_db()
            print(f"Token após confirmação: {user.login_token}")
        else:
            print(f"❌ Erro no reset: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Erro detalhado: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Resposta não é JSON: {response.text}")
                
    except Exception as e:
        print(f"Erro na requisição: {str(e)}")

if __name__ == "__main__":
    test_password_reset_confirmation()
