from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('student-view/', views.StudentAPI.as_view()),
    path('odm', views.home, name='home'),
]

# For query format
#urlpatterns = format_suffix_patterns(urlpatterns)