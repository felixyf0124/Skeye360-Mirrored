from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers
from . import views

urlpatterns = [
    path('hello-view/', views.StudentAPI.as_view()),
    path('odm', views.home, name='home'),
]