"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers
from .models import Student


class StudentSerializers(serializers.Serializer):
    """Serializes a name field for testing out APIView"""
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    age = serializers.IntegerField()
    roll_number = serializers.CharField()

# This is for /api
class StudentSerilizer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ['name', 'age', 'roll_number']