from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

class User(AbstractBaseUser,PermissionsMixin):
    email=models.EmailField(unique=True)
    phone_number=models.CharField(max_length=15,null=True)
    profile_picture=models.ImageField(upload_to='images/profile',null=True) 
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    is_superuser = models.BooleanField(default = False) 
    date_joined=models.DateTimeField(default=timezone.now)
    is_attendee = models.BooleanField(default = False) 
    is_organiser = models.BooleanField(default = False)
    
    objects= UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email

class Attendee(models.Model):
    user= models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True, unique=True)
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    birth_date=models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name}  {self.last_name}"    

@receiver(post_save, sender=Attendee)
def set_user_as_attendee(sender, instance, created, **kwargs):
    if created:  
        user = instance.user
        user.is_attendee = True
        user.save(update_fields=['is_attendee'])

class Organiser(models.Model):
    user= models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True,unique=True)
    name=models.CharField(max_length=255)
    description=models.TextField()
    street = models.CharField(max_length=255, blank=True,null=True)
    area = models.CharField(max_length=255)
    city= models.CharField(max_length=255)
    district= models.CharField(max_length=255)
    province = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    pan_no = models.CharField(max_length=255, blank=True, null=True)  # Optional
    citizenship_no = models.CharField(max_length=255, blank=True, null=True)  # Optional
    document_front = models.ImageField(upload_to='images/identification', blank=True, null=True)  # Optional
    document_back = models.ImageField(upload_to='images/identification', blank=True, null=True)  # Optional
    business_registration_no = models.CharField(max_length=255, blank=True, null=True)  # Optional for individuals
    facebook=models.URLField(blank=True)
    instagram=models.URLField(blank=True)
    twitter=models.URLField(blank=True)
    website=models.URLField(blank=True)
    is_verified=models.BooleanField(default=False)

    def __str__(self):
        return self.name   

@receiver(post_save, sender=Organiser)
def set_user_as_organiser(sender, instance, created, **kwargs):
    if created:  
        user = instance.user
        user.is_organiser = True
        user.save(update_fields=['is_organiser'])
