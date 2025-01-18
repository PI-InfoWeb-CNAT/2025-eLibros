from django.contrib.auth.forms import UserChangeForm
from ..models import Usuario

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