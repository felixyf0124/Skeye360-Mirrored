"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers
from .models import *


# This is for /api
class UserSerilizer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'token', 'timestamp']
