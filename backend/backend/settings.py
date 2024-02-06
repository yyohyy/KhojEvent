"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-#_)wgi&yrx$yk-0!9!q&ftez#!%t8+7c$z%v)n7nqcdw&rc&wd'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


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
    'djoser',
    'events',
    'tickets',
    'users',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS':  [
            os.path.join(BASE_DIR, 'templates'),
            ],
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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'KhojEvent',
        'HOST': 'localhost',
        'USER': 'root',
        'PASSWORD': '#Django12',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST= 'smtp.gmail.com'
EMAIL_PORT= 587
EMAIL_HOST_USER ='khojevent@gmail.com' #os.environ.get('EMAIL_USER')
EMAIL_HOST_PASSWORD= 'uaxilrxjnikktetp' #os.environ.get('EMAIL_PASS')
EMAIL_USE_TLS = True

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators


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
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SIMPLE_JWT = {

   'ACCESS_TOKEN_LIFETIME' :timedelta(days=30),
   'ACCESS_TOKEN_LIFETIME' :timedelta(days=30), 
   'AUTH_HEADER_TYPES': ('Bearer',),
   'ROTATE_REFRESH_TOKENS': True,
   'BLACKLIST_AFTER_ROTATION': True,
}

REST_FRAMEWORK = {

   
    'DEFAULT_AUTHENTICATION_CLASSES': (
        
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
    
    
}

DJOSER= {
    'USER_CREATE_PASSWORD_RETYPE' : True  ,
    'ACTIVATION_URL' :'/activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL' : True ,
    'SEND_CONFIRMATION_EMAIL' : True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION' : True,
    'PASWORD_RESET_CONFIRM_URL' : 'password-reset/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_RETYPE' : True,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND' : True,
    'TOKEN_MODEL' :None,


    'SERIALIZERS' : {
        'user_create' :'users.serializers.UserCreateSerializer',
        'user' :'users.serializers.UserCreateSerializer',
        'token_create': 'djoser.serializers.TokenCreateSerializer',
        'token': 'djoser.serializers.TokenSerializer',
      },
}

AUTH_USER_MODEL = "users.User"

#CORS_ALLOWED_ORIGIN = []

CORS_ORIGIN_ALLOW_ALL= True

