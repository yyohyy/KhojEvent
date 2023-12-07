from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.core.exceptions import ValidationError
from .models import User,Attendee,Organiser


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ("email",)


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ("email",)

class AttendeeForm(forms.ModelForm):
    class Meta:
        model = Attendee
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        user = cleaned_data.get('user')

        if user and hasattr(user, 'organiser'):
            raise ValidationError("Email address already in use.")

        return cleaned_data
    
class OrganiserForm(forms.ModelForm):
    class Meta:
        model = Organiser
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        user = cleaned_data.get('user')

        if user and hasattr(user, 'attendee'):
            raise ValidationError("Email address already in use.")

        return cleaned_data    
