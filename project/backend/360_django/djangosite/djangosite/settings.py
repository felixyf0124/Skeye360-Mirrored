"""
Django settings for djangosite project.

Generated by 'django-admin startproject' using Django 1.11.24.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""
import logging
import os
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import sys

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '6q122#uaxn428#cqkityse((rlw=if)@bd0=ju++l&4w_@hqg8'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'djangosite_api',
    'djangosite',
    'django_filters',
    'django_extensions',
    'corsheaders',
    'knox',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'djangosite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'djangosite.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'ENFORCE_SCHEMA': True,
        'NAME': '360backend',
        'HOST': 'mongodb://myUserAdmin:abc123@172.16.0.4:27017',
        'USER': 'myUserAdmin',
        'PASSWARD': 'abc123',
    },
    'test': {

    }
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

# For rest framework
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
}
# %(threadName)-14s (%(pathname)s:%(lineno)d)
CONFIG_BASE_FILE = os.path.dirname(__file__)
CONSOLE_LOGGING_FORMAT = '%(hostname)s %(asctime)s %(levelname)-8s %(name)s.%(funcName)s: %(message)s'
CONSOLE_LOGGING_FILE_LOCATION = os.path.join(CONFIG_BASE_FILE.split(f'config{os.sep}settings')[0], 'django-wrds.log')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'ignore_something': {
            '()': 'djangosite.logging_helpers.SomethingFilter',
        },
    },
    'formatters': {
        'my_formatter': {
            'format': CONSOLE_LOGGING_FORMAT,
            'class': 'djangosite.logging_helpers.HostnameAddingFormatter',
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false', 'ignore_something', ],
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'my_formatter',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': CONSOLE_LOGGING_FILE_LOCATION,
            'mode': 'a',
            'encoding': 'utf-8',
            'formatter': 'my_formatter',
            'backupCount': 5,
            'maxBytes': 10485760,
        },
    },
    'loggers': {
        '': {
            # The root logger is always defined as an empty string and will pick up all logging that is not collected
            # by a more specific logger below
            'handlers': ['console', 'mail_admins', 'file'],
            'level': os.getenv('ROOT_LOG_LEVEL', 'INFO'),
        },
        'django': {
            # The 'django' logger is configured by Django out of the box. Here, it is reconfigured in order to
            # utilize the file logger and allow configuration at runtime
            'handlers': ['console', 'mail_admins', 'file'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': True,
        },
        'django.server': {
            'propagate': True,
        },
        'django.security.DisallowedHost': {
            'propagate': True,
            'level': 'ERROR',
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}


def exception_hook(type, value, traceback):
    """
    Function to redirect uncaught exceptions to the logger.
    See https://docs.python.org/3.7/library/sys.html#sys.excepthook for more.
    :param type: Type of the exception
    :param value: The exception
    :param traceback: What was happening as a Traceback object
    """
    logging.getLogger('*excepthook*').critical(f'Uncaught Exception!', exc_info=(type, value, traceback))


# The function assigned to sys.excepthook is called only just before control is returned to the prompt; in a Python
# program this happens just before the program exits.
sys.excepthook = exception_hook


CORS_ORIGIN_ALLOW_ALL = True

CORS_ORIGIN_WHITELIST = (
    u'http://0.0.0.0:3000',
    u'http://localhost:3000',
    u'http://127.0.0.1:3000',
    u'http://172.16.0.6:3000'
)

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
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