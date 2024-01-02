from django.conf import settings
from django.forms import ValidationError
from rest_framework import serializers
from .models import User,Attendee,Organiser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'id','email','password']
        extra_kwargs = {
          "password": {"write_only": True},
        }

class AttendeeSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = ['first_name', 'last_name']  

    def create(self, validated_data):
        user = validated_data.pop('user', None)

        if user:
            attendee = Attendee.objects.create(user=user, **validated_data)
            return attendee
        else:
            raise serializers.ValidationError("User details not provided.")

class OrganiserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organiser
        fields = ['first_name', 'last_name']  

    def create(self, validated_data):
   
        user = validated_data.pop('user', None)

        if user:
            organiser = Organiser.objects.create(user=user, **validated_data)
            return organiser
        else:
            raise serializers.ValidationError("User details not provided.")

class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attendee
        fields=['first_name','last_name','birth_date']

class OrganiserSerializer(serializers.ModelSerializer):
    class Meta:
        model=Organiser
        fields=['name','description','address']

class CurrentUserDetails(UserSerializer):
    class Meta:
        model=User
        fields='__all__'
        

class AllUserDetails(serializers.ModelSerializer):
    class Meta:
        model= User
        fields= ['id','email','phone_number','is_active','is_staff','is_attendee','is_organiser']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        is_attendee = data.get('is_attendee')
        is_organiser = data.get('is_organiser')

        if is_attendee == True:
            try:
                attendee = Attendee.objects.get(user=instance)
                attendee_serializer = AttendeeSerializer(attendee)
                data['attendee_details'] = attendee_serializer.data
            except Attendee.DoesNotExist:
                pass

        if is_organiser == True:
            organiser = None  # Initialize organiser with None
            try:
                organiser = Organiser.objects.get(user=instance)
                organiser_serializer = OrganiserSerializer(organiser)
                data['organiser_details'] = organiser_serializer.data
            except Organiser.DoesNotExist:
                pass    

        return data

class UserDetails(serializers.ModelSerializer):
    attendee_details = AttendeeSerializer(source='attendee', read_only=True)
    organiser_details = OrganiserSerializer(source='organiser', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'is_active', 'is_staff', 'is_attendee', 'is_organiser', 'attendee_details', 'organiser_details']


      
#class UserDetails(serializers.ModelSerializer):