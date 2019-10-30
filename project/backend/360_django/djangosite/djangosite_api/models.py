from django.db import models


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
