from django.core.exceptions import ValidationError
import datetime
from django.db import models

def nao_negativo(valor):
    if valor < 0:
        raise ValidationError(f"Atributo tem valor menor que zero")


def nao_nulo(valor):
    if valor == 0:
        raise ValidationError(f"Atributo tem valor nulo")


def verificar_vazio(string):
    if string == '':
        raise ValidationError(f"Atributo de texto possui valor vazio")


#talvez não sejam usados

def nao_e_no_futuro(data):
    if type(data) == datetime.date:
        if data.date() > datetime.datetime.now().date():
            raise ValidationError(f"Data de evento passado não pode estar no futuro")
    elif type(data) == int:
        if data > datetime.datetime.now().year:
            raise ValidationError(f"Ano de evento não pode estar no futuro")
       
def nao_e_no_passado(data):
    if data < datetime.datetime.now().date():
        raise ValidationError(f"Data de evento futuro não pode estar no passado")