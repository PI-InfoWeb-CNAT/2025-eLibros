

from django import forms




class LoginForm(forms.Form):
           
    login = forms.CharField(
        label="Email",
        widget=forms.EmailInput(attrs={
            'id': 'username',
            'name': 'login',
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

    