from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer
from rest_framework import serializers
from .models import User,Attendee,Organiser

User=get_user_model()

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model=User
        fields = [ 'id','email','password','phone_number']
        #REQUIRED_FIELDS=['phone_number']
        extra_kwargs = {
          "password": {"write_only": True},
        }

class AttendeeSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = ['first_name', 'last_name', 'birth_date']

    def create(self, validated_data):
        user = self.context['request'].user  

        if user:
            if Attendee.objects.filter(user=user).exists():
                raise serializers.ValidationError("An organiser account with this email is already in use.")
            if Organiser.objects.filter(user=user).exists():
                raise serializers.ValidationError("An organiser account with this email is already in use.")

            attendee = Attendee.objects.create(user=user, **validated_data)
            return attendee
        else:
            raise serializers.ValidationError("User details not provided.")

class OrganiserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organiser
        fields = ['name', 'address','description','website','facebook','instagram','twitter']  

    def create(self, validated_data):
   
        user = self.context['request'].user  

        if user:
            if Attendee.objects.filter(user=user).exists(): 
                raise serializers.ValidationError("An attendee account with this email is already in use.")
            if Organiser.objects.filter(user=user).exists():
                 raise serializers.ValidationError("An organiser account with this email is already in use.")
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
    
class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','phone_number','is_attendee','is_organiser']

class UserDetailsSerializer(serializers.ModelSerializer):
    attendee_details = AttendeeSerializer(source='attendee')#, read_only=True)
    organiser_details = OrganiserSerializer(source='organiser')#, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'profile_picture', 'attendee_details', 'organiser_details',]

class AttendeeDetailsSerializer(serializers.ModelSerializer):
    attendee_details = AttendeeSerializer(source='attendee')#, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'profile_picture', 'attendee_details',]
    
    def update(self, instance, validated_data):
        attendee_data = validated_data.pop('attendee', {})
        attendee_instance = instance.attendee
        attendee_serializer = AttendeeSerializer(attendee_instance, data=attendee_data, partial=True)

        if attendee_serializer.is_valid():
            attendee_serializer.save()

        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()

        return instance
        # response_data = {
        #     'message': 'ATTENDEE DETAILS UPDATED.',
        #     'instance': instance
        # }
        # return Response(response_data, status=status.HTTP_200_OK)
    
class OrganiserDetailsSerializer(serializers.ModelSerializer):
    organiser_details = OrganiserSerializer(source='organiser')#, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'phone_number', 'profile_picture', 'organiser_details',]
    
    def update(self, instance, validated_data):
        organiser_data = validated_data.pop('organiser', {})
        organiser_instance = instance.organiser
    
        with transaction.atomic():
            organiser_serializer = OrganiserSerializer(organiser_instance, data=organiser_data, partial=True)

            if organiser_serializer.is_valid():
                organiser_serializer.save()

            instance.email = validated_data.get('email', instance.email)
            instance.phone_number = validated_data.get('phone_number', instance.phone_number)
            instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
            instance.save()

            return instance
