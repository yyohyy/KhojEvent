# from django.contrib.auth import get_user_model
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# # from .models import Attendee, Organiser

# # User = get_user_model()

# @receiver(post_save, sender=User.Attendee)
# def set_user_as_attendee(sender, instance, created, **kwargs):
#     if created:  
#         from .models import Attendee
#         user = instance.user
#         user.is_attendee = True
#         user.save(update_fields=['is_attendee'])

# @receiver(post_save, sender=User.Organiser)
# def set_user_as_organiser(sender, instance, created, **kwargs):
#     if created:  
#         from .models import Organiser
#         user = instance.user
#         user.is_organiser = True
#         user.save(update_fields=['is_organiser'])