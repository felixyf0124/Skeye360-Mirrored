"""djangosite URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from knox import views as knox_views
from djangosite_api.views import RegisterAPI, LoginAPI
from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Djangosite API')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('djangosite_api.urls')),
    path('api/auth', include('rest_framework.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    url('api/swagger/', schema_view),
]
