from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = Usuario
    list_display = [
        'email', 
        'username',
        'perfil_preview',
        'nome',
        'CPF',
        'genero',
        'dt_nasc',
      
        ]


    fieldsets = (
        (None, {"fields": ( 
             "username",
            "nome",
            "CPF",
            "foto_de_perfil",
            'genero',
            'dt_nasc',
            'telefone',
            "email", 
            "password",
            )}
        ),
        ("Permissions", {"fields": (
            "is_staff", 
            "is_active", 
            #"groups", 
            #"user_permissions"
            )}
        ),
    )
    add_fieldsets = (
        ( None, {"fields": (
            "email",
            "username",
            "nome",
            "CPF",
            "foto_de_perfil",
            'genero',
            'dt_nasc',
            'telefone',
            "password1",
            "password2",
            "is_staff",
            "is_active",
            #"groups",
            #"user_permissions"
            )}
        ),
    )

admin.site.register(Usuario, UsuarioAdmin)
