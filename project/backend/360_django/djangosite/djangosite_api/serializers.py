"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers


class StudentSerializer(serializers.Serializer):
    """Serializes a name field for testing out APIView"""
    name = serializers.CharField(max_length=10, default="SkeYe360")
    age = serializers.IntegerField(default=10)
    roll_number = serializers.CharField(max_length=20, default="12")
