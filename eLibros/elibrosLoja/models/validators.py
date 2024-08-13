from django.core.exceptions import ValidationError

def nao_negativo(valor):
    if valor < 0:
        raise ValidationError(f"Atributo tem valor menor que zero")


def nao_nulo(valor):
    if valor == 0:
        raise ValidationError(f"Atributo tem valor nulo")


def verificar_vazio(string):
    if string == '':
        raise ValidationError(f"Atributo de texto possui valor vazio")


def validar_data(data):
    if data