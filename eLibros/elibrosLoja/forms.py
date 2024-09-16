from django import forms
from .models import *
from accounts.models import Cliente

class EnderecoCriarForm(forms.Form):
    cep = forms.IntegerField()
    class Meta:
        model = Endereco
        fields = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf',]



  
class UserImageForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ['foto_de_perfil']