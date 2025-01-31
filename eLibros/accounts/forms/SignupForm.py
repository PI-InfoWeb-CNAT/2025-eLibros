from django import forms

class SignupForm(forms.Form):
    name = forms.CharField(
        label="Nome",
        max_length=100,
        widget=forms.TextInput(attrs={
            'id': 'name',
            'name': 'name',
            'placeholder': 'Nome',
            'class': 'form-control'
        })
    )
    email = forms.EmailField(
        label="E-mail",
        widget=forms.EmailInput(attrs={
            'id': 'email',
            'name': 'email',
            'placeholder': 'E-mail',
            'class': 'form-control'
        })
    )
    cpf = forms.CharField(
        label="CPF",
        max_length=14,
        widget=forms.TextInput(attrs={
            'id': 'cpf',
            'name': 'cpf',
            'placeholder': '___.___.___-__',
            'class': 'form-control'
        })
    )
    telefone = forms.CharField(
        label="Telefone",
        max_length=15,
        widget=forms.TextInput(attrs={
            'id': 'telefone',
            'name': 'telefone',
            'placeholder': 'Telefone',
            'class': 'form-control'
        })
    )
    data_nasc = forms.DateField(
        label="Data de nascimento",
        widget=forms.DateInput(attrs={
            'id': 'data_nasc',
            'name': 'data_nasc',
            'type': 'date',
            'placeholder': 'Data de nascimento',
            'class': 'form-control'
        })
    )
    username = forms.CharField(
        label="Nome de usuário",
        max_length=30,
        widget=forms.TextInput(attrs={
            'id': 'username',
            'name': 'username',
            'placeholder': 'Nome de usuário',
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
    confirm_password = forms.CharField(
        label="Confirme sua senha",
        widget=forms.PasswordInput(attrs={
            'id': 'confirm_password',
            'name': 'confirm_password',
            'placeholder': 'Confirme sua senha',
            'class': 'form-control'
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password != confirm_password:
            self.add_error('confirm_password', 'As senhas não conferem.')
        return cleaned_data

    def signup(self, request, user):
        user.nome = self.cleaned_data['name']
        user.CPF = self.cleaned_data['cpf']
        user.telefone = self.cleaned_data['telefone']
        user.dt_nasc = self.cleaned_data['data_nasc']
        user.username = self.cleaned_data['username']
        user.email = self.cleaned_data['email']
        user.set_password(self.cleaned_data['password'])
        user.save()
        return user