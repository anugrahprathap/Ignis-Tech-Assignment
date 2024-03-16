
# Create your views here.
from rest_framework import generics
from .models import Event,Follower
from .serializers import EventSerializer,FollowerSerializer,EventSerializerLike,SignupSerializer
from django.contrib.auth.models import User
class EventListAPIView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .serializers import LoginSerializer

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UserAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve the username of the authenticated user
        username = request.user.username
        # Return the username in the API response
        return Response({'email': username})
class FollowEvent(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(pk=event_id)
            follower, created = Follower.objects.get_or_create(user=request.user, event=event)
            if created:
                serializer = FollowerSerializer(follower)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': f'You are already following {event.title}.'}, status=status.HTTP_200_OK)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
    def delete(self, request, event_id):
        try:
            follower = Follower.objects.get(user=request.user, event_id=event_id)
            follower.delete()
            return Response({'message': 'Event unliked successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Follower.DoesNotExist:
            return Response({'error': 'Event not liked by the user.'}, status=status.HTTP_404_NOT_FOUND)
        

class LikedEventsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve liked events for the authenticated user
        liked_events = Event.objects.filter(follower__user=request.user)
        # Serialize the data
        serializer = EventSerializerLike(liked_events, many=True)
        # Return the serialized data in the response
        return Response(serializer.data)
    
class SignupAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        first_name = serializer.validated_data.get('first_name', '')
        last_name = serializer.validated_data.get('last_name', '')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, email=username,
                                        first_name=first_name, last_name=last_name)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to create user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
