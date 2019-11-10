"""djangosite URL Configuration"""
from django.urls import path, include
from djangosite_api.views import RegisterAPI, LoginAPI

urlpatterns = [
    path('', include('djangosite_api.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
]
