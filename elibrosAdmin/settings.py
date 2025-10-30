from pathlib import Path
import os
import dj_database_url

from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_ROOT = BASE_DIR / "staticfiles"

SECRET_KEY = "django-insecure-0peo@#x9jur3!h$ryje!$879xww8y1y66jx!%*#ymhg&jkozs2"

DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Third-party
    "django_extensions",
    'simple_history',
    
    "elibrosLoja",
    
    "accounts.apps.AccountsConfig",
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',  # Para blacklist de tokens
    'corsheaders',
    'drf_spectacular',  # OpenAPI/Swagger documentation
]

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# JWT Settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,  # Blacklist do token antigo após rotação
    'UPDATE_LAST_LOGIN': True,
    
    # Algoritmo de assinatura
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    
    # Claims customizados
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    # Headers
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Token em cookies (opcional)
    'AUTH_COOKIE': None,  # 'access_token'
    'AUTH_COOKIE_DOMAIN': None,
    'AUTH_COOKIE_SECURE': False,
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'Lax',
}

# https://docs.djangoproject.com/en/dev/ref/settings/#middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # WhiteNoise
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "debug_toolbar.middleware.DebugToolbarMiddleware",  # Django Debug Toolbar
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware"
]

# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = "elibrosAdmin.urls"

# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = "elibrosAdmin.wsgi.application"

# https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # Incluir diretório de templates
        "APP_DIRS": True,  # Habilitar para Django admin funcionar
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# Configuração do banco de dados Neon/PostgreSQL


NEON_DB_URL = os.getenv("NEON_DB_DEV")
if NEON_DB_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=NEON_DB_URL,
            conn_max_age=600,
            ssl_require=True
            )
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "pt-BR"


TIME_ZONE = "America/Sao_Paulo"


USE_I18N = True


USE_TZ = True


LOCALE_PATHS = [BASE_DIR / 'locale']


STATIC_URL = "/static/"


STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL='/media/'
MEDIA_ROOT=os.path.join(BASE_DIR, 'media')


STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "noreply.elibros@gmail.com"
EMAIL_HOST_PASSWORD = "oqnn mame ddsd ybsv"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = "noreply.elibros@gmail.com"
EXPIRE_AFTER = "1h" 

import socket
hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[:-1] + "1" for ip in ips]

AUTH_USER_MODEL = "accounts.Usuario"

# https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1

# https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url

LOGIN_REDIRECT_URL = "inicio"

CSRF_COOKIE_SECURE = False

if 'CODESPACE_NAME' in os.environ:
    codespace_name = os.getenv("CODESPACE_NAME")
    codespace_domain = os.getenv("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
    CSRF_TRUSTED_ORIGINS = [f'https://{codespace_name}-8000.{codespace_domain}', 'https://localhost:8000', 'https://127.0.0.1:8000']

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js development server
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# Headers permitidos para CORS
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Métodos HTTP permitidos
CORS_ALLOWED_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Para debugging - temporariamente permitir todas as origens
# Remova esta linha em produção!
CORS_ALLOW_ALL_ORIGINS = True

if 'CODESPACE_NAME' in os.environ:
    codespace_name = os.environ['CODESPACE_NAME']
    codespace_domain = os.environ.get('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', 'app.github.dev')
    CORS_ALLOWED_ORIGINS.append(f'https://{codespace_name}-3000.{codespace_domain}')


AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
   
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'accounts': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}


# Middleware customizado removido para API pura
# class Custom404ErrorMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#     def __call__(self, request):
#         response = self.get_response(request)
#         if response.status_code == 404:
#             response = render(request, '404.html', status=404)
#         return response

# MIDDLEWARE.append("elibrosAdmin.settings.Custom404ErrorMiddleware")

# drf-spectacular Settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'eLibros API',
    'DESCRIPTION': 'API REST para o sistema de livraria online eLibros - Desenvolvido com Django REST Framework',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    
    # Autenticação
    'COMPONENT_SPLIT_REQUEST': True,
    'SECURITY': [
        {
            'bearerAuth': []
        }
    ],
    
    # Schema customization
    'SCHEMA_PATH_PREFIX': r'/api/v1',
    'SCHEMA_PATH_PREFIX_TRIM': True,
    
    # Configurações de UI
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
        'defaultModelsExpandDepth': 1,
        'defaultModelExpandDepth': 1,
        'defaultModelRendering': 'model',
        'displayRequestDuration': True,
        'docExpansion': 'list',
        'filter': True,
        'showExtensions': True,
        'showCommonExtensions': True,
        'tryItOutEnabled': True,
    },
    
    # Configurações de componentes
    'COMPONENT_NO_READ_ONLY_REQUIRED': True,
    
    # Tags e agrupamento
    'TAGS': [
        {'name': 'Autenticação', 'description': 'Endpoints de login, logout e gerenciamento de tokens JWT'},
        {'name': 'Usuários', 'description': 'Gerenciamento de usuários e perfis'},
        {'name': 'Livros', 'description': 'Catálogo de livros e operações relacionadas'},
        {'name': 'Autores', 'description': 'Gerenciamento de autores'},
        {'name': 'Categorias', 'description': 'Categorias de livros'},
        {'name': 'Gêneros', 'description': 'Gêneros literários'},
        {'name': 'Clientes', 'description': 'Perfil de clientes e informações'},
        {'name': 'Carrinhos', 'description': 'Carrinho de compras'},
        {'name': 'Pedidos', 'description': 'Gerenciamento de pedidos'},
        {'name': 'Avaliações', 'description': 'Avaliações e comentários de livros'},
        {'name': 'Cupons', 'description': 'Cupons de desconto'},
        {'name': 'Admin', 'description': 'Endpoints administrativos'},
        {'name': 'Utilidades', 'description': 'Endpoints utilitários e estatísticas'},
    ],
    
    # Informações de contato e licença
    'CONTACT': {
        'name': 'Equipe eLibros',
        'email': 'noreply.elibros@gmail.com',
    },
    'LICENSE': {
        'name': 'MIT License',
    },
    
    # Servidores
    'SERVERS': [
        {
            'url': 'http://localhost:8000',
            'description': 'Servidor de Desenvolvimento',
        },
        {
            'url': 'https://two025-elibros.onrender.com',
            'description': 'Servidor de Produção',
        },
    ],
}

