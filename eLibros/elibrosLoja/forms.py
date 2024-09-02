from statistics import mode
from django import forms

from .models import *

class EnderecoCriarForm(forms.Form):
    cep = forms.IntegerField()
    class Meta:
        model = Endereco
        fields = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf',]