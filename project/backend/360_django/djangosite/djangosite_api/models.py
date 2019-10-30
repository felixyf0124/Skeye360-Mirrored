from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles


# The following is the example you can use
# LEXERS = [item for item in get_all_lexers() if item[1]]
# LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
# STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])


class User(models.Model):
    username = models.CharField(max_length=255, null=True)
    token = models.CharField(max_length=255, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class City(models.Model):
    city_name = models.CharField(max_length=20, null=True)

class District(models.Model):
    district_name = models.CharField(max_length=20, null=True)

class Intersection(models.Model):
    latitude = models.IntegerField(null=True)
    longitude = models.IntegerField(null=True)

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
    