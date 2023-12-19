from django.contrib import admin

# Register your models here.
from .models import Events, category, Review, Tag 
admin.site.register(Events)
admin.site.register(category)
admin.site.register(Review)
admin.site.register(Tag)