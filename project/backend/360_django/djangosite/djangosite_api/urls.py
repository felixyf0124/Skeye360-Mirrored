from django.urls import path
from rest_framework import routers
from djangosite_api import views

urlpatterns = [
    path('hello-view/', views.HelloWorld.as_view()),
    path('odm', views.home, name='home')
]