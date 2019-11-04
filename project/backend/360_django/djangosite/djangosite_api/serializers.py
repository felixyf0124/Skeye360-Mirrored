"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers
from .models import *


# This is for /api
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'token', 'timestamp']


class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ['city_name']


class DistrictSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = District
        fields = ['district_name']


class IntersectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Intersection
        fields = ['latitude', 'longitude']


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
