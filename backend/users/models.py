from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
from django.db import models
from django.utils import timezone
from .managers import UserManager

class User(AbstractBaseUser,PermissionsMixin):
    email=models.EmailField(unique=True)
    phone_number=models.CharField(max_length=15,null=True)
    profile_picture=models.ImageField(null=True)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    is_superuser = models.BooleanField(default = False) 
    date_joined=models.DateTimeField(default=timezone.now)

    objects= UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []