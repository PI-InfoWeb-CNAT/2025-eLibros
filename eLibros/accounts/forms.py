from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Cliente
class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Cliente
        fields = ('email', 'username', 'nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc')

class CustomUserChangeForm(UserChangeForm):

    class Meta(UserChangeForm.Meta):
        model = Cliente
        fields = ('email', 'username', 'nome', 'CPF', 'genero', 'outro_genero', 'dt_nasc')