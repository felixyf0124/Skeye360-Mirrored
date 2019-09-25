"""These classes are used to serialize data to send them in a JSON format"""
#from django.contrib.auth.models import User, Group
from rest_framework import serializers
from djangsite_api import models

class HelloSerializer(serializers.Serializer):
    """Serializes a name field for testing out APIView"""
    name = serializers.CharField(max_length=10)
