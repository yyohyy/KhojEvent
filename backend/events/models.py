from django.db import models
import uuid

class category(models.Model):
   name = models.CharField(max_length=200)
   created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
   id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    
   
   def __str__(self):
        return self.name
    
class Events(models.Model):
    name = models.CharField(max_length=100, null=True)
    categories = models.ManyToManyField('category')
    venue = models.CharField(max_length=100, null=True)
    description = models.TextField(null=True, blank=True)  #in a databases but may not contain info and blank is for we are allowed to submit the form with the value being empty
    date = models.IntegerField(default=0, null=True)
    time = models.IntegerField(default=0, null=True)
    site_link = models.CharField(max_length= 600, null=True, blank=True)
    source_link = models.CharField(max_length=2000, null=True, blank=True) #link up a github link maybe
    tags = models.ManyToManyField('Tag', blank=True)
    vote_total = models.IntegerField(default=0, null=True, blank=True)
    vote_ratio = models.IntegerField(default=0, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
    id = models.UUIDField(default=uuid.uuid1, unique=True, primary_key=True, editable=False) 
    
    def __str__(self):
        return self.name
    
    
class Review(models.Model):
    VOTE_TYPE = (
        ('up', 'Up Vote'),
        ('down', 'Down Vote'),
    )
    #owner =
    event = models.ForeignKey(Events, on_delete=models.CASCADE) #deletes all the review if the event is deleted
    body = models.TextField(null=True, blank=True)
    value = models.CharField(max_length=200, choices=VOTE_TYPE)
    created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False) 
    
    def __str__(self):
        return self.value
    
class Tag(models.Model):
    name= models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True) #to know about the time and date of adding data to the db and and automatically create a time for each added model 
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False) 
    
    
    def __str__(self):
        return self.name
    
