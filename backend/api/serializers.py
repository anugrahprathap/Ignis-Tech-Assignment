from rest_framework import serializers
from .models import Event,Follower
from django.contrib.auth.models import User
# In your serializers.py

from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    # Add a field to indicate whether the event is liked by the authenticated user
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_is_liked(self, obj):
        # Retrieve the authenticated user from the context
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.follower_set.filter(user=user).exists()
        return False
class EventSerializerLike(serializers.ModelSerializer):
    

    class Meta:
        model = Event
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = '__all__'

from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
