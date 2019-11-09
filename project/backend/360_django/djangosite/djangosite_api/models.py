import uuid
from django.db import models
from django.contrib.auth.models import User


class Account(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=True)
    owner = models.ForeignKey(User, related_name="account", on_delete=models.CASCADE, null=True)


class City(models.Model):
    city_name = models.CharField(max_length=20, null=True)


class District(models.Model):
    district_name = models.CharField(max_length=20, null=True)


class Intersection(models.Model):
    intersection_name = models.CharField(max_length=50, null=True)
    latitude = models.IntegerField(null=True)
    longitude = models.IntegerField(null=True)
    district_id = models.ForeignKey(District, related_name='intersections', on_delete=models.CASCADE, null=True)


class Camera(models.Model):
    id = models.AutoField(primary_key=True)
    camera_url = models.CharField(max_length=20, null=True)
    intersection_id = models.ForeignKey(Intersection, related_name='cameras', on_delete=models.CASCADE, null=True)


class Trafficlight(models.Model):
    green_time = models.IntegerField(null=True)
    yellow_time = models.IntegerField(null=True)
    red_time = models.IntegerField(null=True)


class Count(models.Model):
    c_direction = models.CharField(max_length=2, null=True)
    count_type = models.CharField(max_length=10, null=True)


class Time(models.Model):
    hours = models.IntegerField(null=True)
    minutes = models.IntegerField(null=True)


class Prediction(models.Model):
    p_direction = models.CharField(max_length=2, null=True)
    count_type = models.CharField(max_length=10, null=True)


class Vehicle(models.Model):
    vehicle_centroid = models.CharField(max_length=30, null=True)
    vehicle_time = models.DateTimeField(auto_now_add=True)


class Pedestrian(models.Model):
    pedestrian_centroid = models.CharField(max_length=30, null=True)
    pedestrian_time = models.DateTimeField(auto_now_add=True)


class Userlog(models.Model):
    log_message = models.CharField(max_length=255)
    log_time = models.DateTimeField(auto_now_add=True)
    user_id = models.ForeignKey(Account, related_name='user_logs', on_delete=models.CASCADE)
