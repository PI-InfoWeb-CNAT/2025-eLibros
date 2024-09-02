from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Cliente

class ClienteAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = Cliente
    list_display = ['email', 'username', 'nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc'] #OK

admin.site.register(Cliente, ClienteAdmin)
