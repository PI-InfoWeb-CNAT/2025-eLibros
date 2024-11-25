from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Cliente

class ClienteAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = Cliente
    list_display = ['email', 'username', 'perfil_preview', 'nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc', 'endereco'] #OK


    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc', 'endereco')}), 
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc', 'endereco')}), 
    )

admin.site.register(Cliente, ClienteAdmin)
