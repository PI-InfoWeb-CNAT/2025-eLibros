
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import Usuario
from .forms import LoginForm, SignupForm

from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from elibrosLoja.models import Cliente
import logging
logger = logging.getLogger(__name__)

# Create your views here.

class LoginViews:

    def login_view(request):
        message = None
        if request.user.is_authenticated:
            return redirect('/')
                
        if request.method == 'POST':
            loginForm = LoginForm(request.POST)
            if loginForm.is_valid():
                user = authenticate(
                    request,
                    username=loginForm.cleaned_data['login'],
                    password=loginForm.cleaned_data['password']
                )
                if user is not None:
                    login(request, user)
                    next_url = request.GET.get('next', '/')
                    return redirect(next_url)
                    # if user.email_is_verified:
                    #     login(request, user)
                    #     next_url = request.GET.get('next', '/')
                    #     return redirect(next_url)
                    # else:
                    #     message = {'type': 'warning', 'text': 'Sua conta ainda não foi verificada!'}
                    #     return redirect('verify-email', user=user)
                else:
                    message = {'type': 'error', 'text': 'Email e/ou senha inválidos!'}
        else:
            loginForm = LoginForm()

        response = render(request, 'account/login.html', {
            'form': loginForm, 
            'message': message,
            'title': 'Login',
            'button_text': 'Entrar',
            'link_text': 'Registrar', 
            'link_href': '/register'
        })

        response['X-Frame-Options'] = 'SAMEORIGIN'
        return response

    # Falta adicionar verificações padrão de senha do django
    @staticmethod
    def register_view(request):
        registerForm = SignupForm()
        message = None
        if request.user.is_authenticated:
            return redirect('/')
        if request.method == 'POST':
            username = request.POST['username']
            email = request.POST['email']
            password = request.POST['password']
            registerForm = SignupForm(request.POST)
        
            if registerForm.is_valid():
                verifyUsername = Usuario.objects.filter(username=username).first()
                verifyEmail = Usuario.objects.filter(email=email).first()
                if verifyUsername is not None:
                    message = {'type': 'danger', 'text': 'Já existe um usuário com este username!'}
                elif verifyEmail is not None:
                    message = {'type': 'danger', 'text': 'Já existe um usuário com este e-mail!'}
                else:     
                    user = Usuario.objects.create_user(username=username, email=email, password=password)
                    registerForm.signup(request, user)
                    if user is not None:
                        print(user)
                        Cliente.objects.create(user=user)
                        message = {'type': 'success', 'text': 'Conta criada com sucesso!'}
                        next = request.GET.get('next')
                        if next:
                            return redirect(next)
                        else:
                            return redirect('verify-email', user=user)        
                    else:
                        message = {'type': 'danger', 'text': 'Um erro ocorreu ao tentar criar o usuário.'}
                    
        context = {'form': registerForm, 'message': message, 'title': 'Registrar', 'button_text': 'Registrar', 'link_text': 'Login', 'link_href': '/login'}
        return render(request, template_name='account/signup.html', context=context, status=200)
    
    @staticmethod
    def verify_email(request, user):
        user = Usuario.objects.get(email=user)
        if not user.email_is_verified:
            logger.debug("User email not verified, sending verification email")
            try:
                email = user.email
                subject = "Ative sua conta eLibros"
                context = {
                    'user': user,
                    'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': account_activation_token.make_token(user),
                }
                logger.debug(f"Email context prepared: {context}")

                message = render_to_string('account/verify_email_message.html', context)
                email = EmailMessage(subject, message, to=[email])
                email.content_subtype = "html"
                
                email.send()
                logger.debug("Verification email sent successfully, rendering now 'verify email done' template")
                return redirect('verify-email-done')
            except Exception as e:
                logger.error(f"Error sending verification email: {str(e)}")
                messages.error(request, "Error sending verification email")
                return redirect('/')
        else:
            logger.debug("User email already verified, redirecting to home page")
            return redirect('/')
                                

    @staticmethod
    def logout_view(request):
        logout(request)
        return redirect('/')                

    @staticmethod
    def verify_email_done(request):
        return render(request, 'account/verify_email_done.html')

    @staticmethod
    def verify_email_confirm(request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Usuario.objects.get(pk=uid)
            logger.debug(f"Verifying email for user ID: {uid}")
            logger.debug(f"User found: {user.email}")
            logger.debug(f"Current verification status: {user.email_is_verified}")
            logger.debug(f"Token validation result: {account_activation_token.check_token(user, token)}")
        except(TypeError, ValueError, OverflowError, Usuario.DoesNotExist) as e:
            logger.error(f"Error decoding user ID: {str(e)}")
            user = None
        
        if user is not None and account_activation_token.check_token(user, token):
            user.email_is_verified = True
            user.save()
            messages.success(request, 'Email verificado com sucesso!')
            login(request, user)
            return redirect('/')
        else:
            logger.warning(f"Invalid verification attempt for uidb64: {uidb64}")
            messages.warning(request, 'Link de verificação inválido!')
        return render(request, 'account/verify_email_confirm.html')
        
    @staticmethod
    def verify_email_complete(request):
        return render(request, 'account/verify_email_complete.html')