from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from .views import *
from . import views

router = routers.DefaultRouter()
router.register('api/user', UserViewSet, 'user')
router.register('api/city', CityViewSet, 'city')
router.register('api/district', DistrictViewSet, 'district')
router.register('api/intersection', IntersectionViewSet, 'intersection')
router.register('api/trafficLight', TrafficLightViewSet, 'trafficlight')
router.register('api/count', CountViewSet, 'count')
router.register('api/time', TimeViewSet, 'time')
router.register('api/prediction', PredictionViewSet, 'prediction')
router.register('api/vehicle', VehicleViewSet, 'vehicle')
router.register('api/pedestrian', PedestrianViewSet, 'pedestrian')

urlpatterns = router.urls
