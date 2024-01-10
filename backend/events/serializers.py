from rest_framework import serializers
from events.models import Events, category, Tag, Organiser

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = '__all__'
        
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        
class OrganiserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organiser 
        fields = '__all__'
        

class EventsSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    categories = CategorySerializer(many=True)
    organizer = OrganiserSerializer(many=False)
    class Meta:
        model = Events
        fields = '__all__'