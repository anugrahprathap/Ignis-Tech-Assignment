from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('paid', 'Paid'),
        ('free', 'Free'),
    ]

    title = models.CharField(max_length=255)
    datetime = models.CharField(max_length=255)
    location = models.CharField(max_length =255,blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    organizer = models.CharField(max_length=255,blank=True)
    image = models.URLField()
    type = models.CharField(max_length=4, choices=EVENT_TYPE_CHOICES, default='free')

    def __str__(self):
        return self.title
class Follower(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['user', 'event']

    def __str__(self):
        return f"{self.user.username} follows {self.event.title}"
    
    