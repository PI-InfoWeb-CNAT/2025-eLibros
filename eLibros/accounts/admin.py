from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Cliente

class ClienteAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = Cliente
    list_display = ['email', 'username', 'perfil_preview', 'nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc', 'get_enderecos'] #OK

    def get_enderecos(self, obj):
        return ", ".join([endereco.cep for endereco in obj.enderecos.all()])
    get_enderecos.short_description = 'Endereços'

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc', 'enderecos')}), 
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc', 'enderecos')}), 
    )

admin.site.register(Cliente, ClienteAdmin)
