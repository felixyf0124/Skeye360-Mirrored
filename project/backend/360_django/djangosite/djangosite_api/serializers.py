"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import *

# New UserSerializer using Django User model (19:39)
class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['username', 'password']


class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['city_name']


class CameraSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Camera
        fields = ['id', 'camera_url', 'intersection_id']


class IntersectionSerializer(serializers.ModelSerializer):
    cameras = CameraSerializer(many=True, read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Intersection
        fields = ['id', 'intersection_name', 'latitude', 'cameras', 'longitude', 'district_id']


class DistrictSerializer(serializers.HyperlinkedModelSerializer):
    intersections = IntersectionSerializer(many=True, read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = District
        fields = ['id', 'district_name', 'intersections']


class TrafficLightSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trafficlight
        fields = ['green_time', 'yellow_time', 'red_time']


class CountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Count
        fields = ['c_direction', 'count_type']


class TimeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Time
        fields = ['hours', 'minutes']


class PredictionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Prediction
        fields = ['p_direction', 'count_type']


class VehicleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['vehicle_centroid', 'vehicle_time']


class PedestrianSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pedestrian
        fields = ['pedestrian_centroid', 'pedestrian_time']


class UserlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userlog
        fields = ['log_message', 'log_time', 'user_id']


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    user_logs = UserlogSerializer(many=True, read_only=True)
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'name', 'user_logs']
