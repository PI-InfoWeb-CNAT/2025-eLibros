from django.urls import path
from accounts.views import LoginViews
from django.contrib.auth import views as auth_views

from django.urls import path
from accounts.views import LoginViews
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Update URL patterns to be explicit about trailing slashes
    path("login/", LoginViews.login_view, name='login'),
    path("logout/", LoginViews.logout_view, name='logout'),
    path("signup/", LoginViews.register_view, name='signup'),
    
    path('password_reset/', auth_views.PasswordResetView.as_view(
        template_name="account/password_reset.html",
        email_template_name="account/password_reset_email.html",
        subject_template_name="account/password_reset_subject.txt"), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name="account/password_reset_done.html"), name='password_reset_done'),
    path('password_reset/confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="account/password_reset_confirm.html"), name='password_reset_confirm'),
    path('password_reset/complete/', auth_views.PasswordResetCompleteView.as_view(template_name="account/password_reset_complete.html"), name='password_reset_complete'),

    path('password_change/', auth_views.PasswordChangeView.as_view(template_name="account/password_change.html"), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(template_name="account_password_change_done.html"), name='password_change_done'),

    path('verify-email/<str:user>', LoginViews.verify_email, name='verify-email'),
    path('verify-email/done/', LoginViews.verify_email_done, name='verify-email-done'),
    path('verify-email-confirm/<uidb64>/<token>/', LoginViews.verify_email_confirm, name='verify-email-confirm'),
    path('verify-email/complete/', LoginViews.verify_email_complete, name='verify-email-complete'),
]
  