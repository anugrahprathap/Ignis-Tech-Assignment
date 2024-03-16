from django.contrib import admin

# Register your models here.
from .models import Event,Follower
admin.site.register(Event)
admin.site.register(Follower)