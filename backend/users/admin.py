from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserCreationForm, UserChangeForm, AttendeeForm, OrganiserForm
from .managers import UserManager 
from .models import User,Attendee,Organiser

class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = ("email", "is_staff", "is_active","is_attendee","is_organiser")
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("profile_picture","phone_number","is_staff", "is_active","is_attendee","is_organiser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2","profile_picture","phone_number" ,"is_staff",
                "is_active","is_attendee","is_organiser","groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)

class AttendeeAdmin(admin.ModelAdmin):
    form=AttendeeForm
    list_display=['user','first_name','last_name']
    

class OrganiserAdmin(admin.ModelAdmin):
    form=OrganiserForm
    list_display=['user','name']    

admin.site.register(User, UserAdmin)
admin.site.register(Attendee,AttendeeAdmin)
admin.site.register(Organiser,OrganiserAdmin)