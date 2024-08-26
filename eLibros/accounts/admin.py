from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Cliente

class Admin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = Cliente
    list_display = ['email', 'username',]

admin.site.register(Cliente, Admin)