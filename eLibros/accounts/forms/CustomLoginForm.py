from allauth.account.forms import LoginForm
from django import forms

class CustomLoginForm(LoginForm):
    login = forms.CharField(
        label="Email",
        widget=forms.TextInput(attrs={
            'id': 'username',
            'name': 'username',
            'placeholder': 'Email',
            'class': 'form-control'
        })
    )
    password = forms.CharField(
        label="Senha",
        widget=forms.PasswordInput(attrs={
            'id': 'password',
            'name': 'password',
            'placeholder': 'Senha',
            'class': 'form-control'
        })
    )
    remember = forms.BooleanField(
        label="Lembre-se de mim",
        required=False,
        widget=forms.CheckboxInput(attrs={
            'id': 'myCheckbox1',
            'class': 'custom-checkbox'
        })
    )

    def login(self, *args, **kwargs):
        return super(CustomLoginForm, self).login(*args, **kwargs)