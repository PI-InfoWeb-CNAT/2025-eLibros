from django.urls import path
from .views import login_view, logout_view, register_view

urlpatterns = [
    path("login", login_view, name='login'),
    path("logout", logout_view, name='logout'),
    path("signup", register_view, name='signup'),
   
]