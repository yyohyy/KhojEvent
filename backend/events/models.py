from django.db import models
from users.models import Organiser
from users.models import Attendee
# from django.utils import timezone
# import uuid

class Category(models.Model):
   name = models.CharField(max_length=200)
   created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
   #id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
   
   def __str__(self):
        return self.name 
    
class Event(models.Model):
    name = models.CharField(max_length=100, null=True)
    organiser = models.ForeignKey(Organiser, on_delete=models.CASCADE, null=True)#, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    venue = models.CharField(max_length=100, null=True)
    description = models.TextField(null=True)  #in a databases but may not contain info and blank is for we are allowed to submit the form with the value being empty
    tags = models.ManyToManyField('Tag')
    image = models.ImageField(upload_to='iamges/events', null=True)
    is_paid = models.BooleanField(default=False)       # Field indicating if the event is paid
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    #site_link = models.CharField(max_length= 600, null=True, blank=True)
    #approved = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
    #id = models.UUIDField(default=uuid.uuid1, unique=True, primary_key=True, editable=False) 
    
    def __str__(self):
        return self.name
    
    
class Review(models.Model):
    attendee = models.OneToOneField(Attendee, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE) #deletes all the review if the event is deleted
    body = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
    #id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False) 
    
    def __str__(self):
        return f"{self.event.name} - {self.body}"

class Rating(models.Model):
    STARS_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )
    attendee = models.OneToOneField(Attendee, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    stars = models.IntegerField(choices=STARS_CHOICES, default=0)

    def __str__(self):
        return f"{self.event.name} - {self.stars} Stars"


    
class Tag(models.Model):
    name= models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
    #id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False) 
    
    
    def __str__(self):
        return self.name
    
