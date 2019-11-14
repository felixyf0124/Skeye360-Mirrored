"""These classes are used to serialize data to send them in a JSON format"""
from rest_framework import serializers
from rest_meets_djongo.serializers import DjongoModelSerializer
from .models import *

#https://github.com/nesdis/djongo/issues/298

class CitySerializer(DjongoModelSerializer):
    class Meta:
        model = City
        fields = ['city_name']


class CameraSerializer(DjongoModelSerializer):
    camera_url = serializers.CharField(required=True)

    class Meta:
        model = Camera
        fields = ['id', 'camera_url', 'intersection_id']


class IntersectionSerializer(DjongoModelSerializer):
    cameras = CameraSerializer(many=True, read_only=True)

    class Meta:
        model = Intersection
        fields = ['id', 'intersection_name', 'latitude', 'cameras', 'longitude', 'district_id']


class DistrictSerializer(DjongoModelSerializer):
    intersections = IntersectionSerializer(many=True, read_only=True)
    #id = serializers.IntegerField(read_only=True)
    district_name = serializers.CharField(required=True)

    class Meta:
        model = District
        fields = ['id', 'district_name', 'intersections']


class TrafficLightSerializer(DjongoModelSerializer):
    class Meta:
        model = Trafficlight
        fields = ['green_time', 'yellow_time', 'red_time']


class CountSerializer(DjongoModelSerializer):
    class Meta:
        model = Count
        fields = ['c_direction', 'count_type']


class TimeSerializer(DjongoModelSerializer):
    class Meta:
        model = Time
        fields = ['hours', 'minutes']


class PredictionSerializer(DjongoModelSerializer):
    class Meta:
        model = Prediction
        fields = ['p_direction', 'count_type']


class VehicleSerializer(DjongoModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['vehicle_centroid', 'vehicle_time']


class PedestrianSerializer(DjongoModelSerializer):
    class Meta:
        model = Pedestrian
        fields = ['pedestrian_centroid', 'pedestrian_time']


class UserlogSerializer(DjongoModelSerializer):
    class Meta:
        model = Userlog
        fields = ['log_message', 'log_time', 'user_id']


class RegisterSerializer(DjongoModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']


class LoginSerializer(DjongoModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
