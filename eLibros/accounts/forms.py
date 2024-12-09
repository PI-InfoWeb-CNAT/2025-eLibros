# users/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario


class CustomUserCreationForm(UserCreationForm):
    """
    Specify the user model created while adding a user
    on the admin page.
    """
    class Meta:
        model = Usuario
        fields = [
            "username",
            "nome",
            "CPF",
            "foto_de_perfil",
            'genero',
            'dt_nasc',
            'telefone',
            "email",
            "password", 
            "is_staff",
            "is_active",
            # "groups",
            # "user_permissions"
        ]
class CustomUserChangeForm(UserChangeForm):
    """
    Specify the user model edited while editing a user on the
    admin page.
    """
    class Meta:
        model = Usuario
        fields = [
            "username",
            "nome",
            "CPF",
            "foto_de_perfil",
            'genero',
            'dt_nasc',
            'telefone',
            "email",
            "password", 
            "is_staff",
            "is_active",
            #"groups",
            #"user_permissions"
         ]