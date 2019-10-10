"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers
from .models import *


class StudentSerializers(serializers.Serializer):
    """Serializes a name field for testing out APIView"""
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    roll_number = serializers.CharField()

    def create(self, validated_data):
        """
        Create and return a new `Student` instance, given the validated data.
        """
        return Student.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Student` instance, given the validated data.
        """
        instance.id = serializers.IntegerField(read_only=True)
        instance.roll_number = validated_data.get('roll_number', instance.roll_number)
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance


# This is for /api
class StudentSerilizer(serializers.HyperlinkedModelSerializer):
    class Meta:
        id = serializers.IntegerField(read_only=True)
        model = Student
        fields = ['name', 'age', 'roll_number', 'id', 'timestamp']
