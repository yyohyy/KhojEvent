from rest_framework import serializers
from events.models import Event, Category, Tag, Organiser, Rating, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
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
        fields = ["event", "stars", "attendee"]
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review 
        fields = '__all__'
        

class EventSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)
    category = CategorySerializer(many=False)
   # organizer = OrganiserSerializer(many=False)
    class Meta:
        model = Event
        fields = ["name", "category", "description", "venue", "start_date", "end_date", "start_time", "end_time","tags", "is_paid", "id"]

    def create(self, validated_data):
        category_data = validated_data.pop('category', [])
        tags_data = validated_data.pop('tags', [])

        # Create or get Category instances
        category_instance, created = Category.objects.get_or_create(name=category_data["name"])

        # Create or get Tag instances
        tags_instances = [Tag.objects.get_or_create(**tag_data)[0] for tag_data in tags_data]

        validated_data['category'] = category_instance
        # Create the Event instance with the modified data
        event_instance = Event.objects.create(**validated_data)
    
        # Add the categories and tags to the Event instance
        #event_instance.categories.id = categories_instances.pk
        event_instance.tags.set(tags_instances)

        return event_instance
    def update(self, instance, validated_data):
        # Update standard fields
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.venue = validated_data.get('venue', instance.venue)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.is_paid = validated_data.get('is_paid', instance.is_paid)

        # Update category
        category_data = validated_data.get('category', {})
        category_instance, created = Category.objects.get_or_create(**category_data)
        instance.category = category_instance

        # Update tags
        tags_data = validated_data.get('tags', [])
        tags_instances = [Tag.objects.get_or_create(**tag_data)[0] for tag_data in tags_data]
        instance.tags.set(tags_instances)

        # Save the updated instance
        instance.save()

        return instance
