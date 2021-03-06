"""camera URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
# from django.urls import path
from django.conf.urls import url
from recognition import views as recognition_views
from real_time import views as realtime_views

urlpatterns = [
    url('admin/', admin.site.urls),
    url('cam/', recognition_views.cam),
    url('coord/',recognition_views.send_json),
    url('los/',recognition_views.get_level_of_service),
    url('lights/',recognition_views.get_light_signals),
    url('timers/',realtime_views.get_timers),
]
