from rest_framework import serializers
from events.models import Event, category, Tag, Organiser, Rating, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = 'name'
        
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = 'name'
        
class OrganiserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organiser 
        fields = '__all__'
        
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating 
        fields = ["events", "stars"]
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review 
        fields = '__all__'
        

class EventSerializer(serializers.ModelSerializer):
    #tags = TagSerializer(many=True)
    #categories = CategorySerializer(many=False)
    #organizer = OrganiserSerializer(many=False)
    class Meta:
        model = Event
        fields = ["name", "categories", "description", "venue", "start_date", "end_date", "start_time", "end_time","tags", "is_paid","id"]