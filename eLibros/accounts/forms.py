from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Cliente

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Cliente
        fields = ('email', 'username',)

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = Cliente
        fields = ('email', 'username',)