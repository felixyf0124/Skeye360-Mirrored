"""djangosite URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from knox import views as knox_views
from djangosite_api.views import RegisterAPI, LoginAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('djangosite_api.urls')),
    path('api/auth', include('rest_framework.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
]
