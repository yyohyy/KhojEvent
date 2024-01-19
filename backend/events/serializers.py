from rest_framework import serializers
from events.models import Event, category, Tag, Organiser, Rating, Review

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
        
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating 
        fields = ["events", "stars"]
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review 
        fields = '__all__'
        

class EventSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    categories = CategorySerializer(many=False)
   # organizer = OrganiserSerializer(many=False)
    class Meta:
        model = Event
        fields = ['name', "categories", "description", "venue", "start_date", "end_date", "start_time", "end_time","tags", "is_paid"]

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])
        tags_data = validated_data.pop('tags', [])

        # Create or get Category instances
        categories_instances= category.objects.get(name=categories_data["name"])

        # Create or get Tag instances
        tags_instances = [Tag.objects.get_or_create(**tag_data)[0] for tag_data in tags_data]

        validated_data['categories'] = categories_instances
        # Create the Event instance with the modified data
        event_instance = Event.objects.create(**validated_data)
    
        # Add the categories and tags to the Event instance
        #event_instance.categories.id = categories_instances.pk
        event_instance.tags.set(tags_instances)

        return event_instance