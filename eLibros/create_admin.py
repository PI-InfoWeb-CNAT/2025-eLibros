#!/usr/bin/env python
import os
import django

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "elibrosAdmin.settings")
django.setup()

from accounts.models import Usuario

# Verificar usuários existentes
print("=== Usuários existentes ===")
usuarios = Usuario.objects.all()
for user in usuarios:
    print(f"Email: {user.email}, Username: {user.username}, Is Staff: {user.is_staff}, Is Superuser: {user.is_superuser}")

print("\n=== Criando/Atualizando superusuário ===")

# Usar o primeiro usuário que já é superusuário
admin_user = Usuario.objects.filter(is_superuser=True).first()

if admin_user:
    print(f"Superusuário encontrado: {admin_user.email}")
    # Atualizar senha para algo conhecido
    admin_user.set_password("admin123")
    admin_user.save()
    print(f"Senha atualizada para: admin123")
    
    print("\n=== Credenciais de acesso ===")
    print(f"Email: {admin_user.email}")
    print(f"Senha: admin123")
    print(f"URL Admin: http://localhost:8000/djangoadmin/")
else:
    # Se não houver superusuário, promover um usuário existente
    user = Usuario.objects.first()
    if user:
        user.is_staff = True
        user.is_superuser = True
        user.set_password("admin123")
        user.save()
        print(f"Usuário {user.email} promovido a superusuário!")
        
        print("\n=== Credenciais de acesso ===")
        print(f"Email: {user.email}")
        print(f"Senha: admin123")
        print(f"URL Admin: http://localhost:8000/djangoadmin/")
    else:
        print("Nenhum usuário encontrado para promover!")
