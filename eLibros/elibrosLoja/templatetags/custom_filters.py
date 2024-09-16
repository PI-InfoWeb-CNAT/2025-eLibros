from django import template

register = template.Library()

@register.filter
def split_decimal(value):
    try:
        integer_part, decimal_part = str(value).split('.')
        return integer_part, decimal_part
    except ValueError:
        return value, '00'  # Default to '00' if there's no decimal part