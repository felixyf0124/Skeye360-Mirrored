from rest_framework import routers
from .views import *

app_name = 'skeye360'
# This class is main url class using router, and the parameter is url, view, base_name
router = routers.DefaultRouter()
router.register('api/city', CityViewSet, 'city')
router.register('api/district', DistrictViewSet, 'district')
router.register('api/intersection', IntersectionViewSet, 'intersection')
router.register('api/trafficLight', TrafficLightViewSet, 'trafficlight')
router.register('api/count', CountViewSet, 'count')
router.register('api/time', TimeViewSet, 'time')
router.register('api/prediction', PredictionViewSet, 'prediction')
router.register('api/vehicle', VehicleViewSet, 'vehicle')
router.register('api/pedestrian', PedestrianViewSet, 'pedestrian')
router.register('api/userlog', UserlogViewSet, 'userlog')
router.register('api/camera', CameraViewSet, 'camera')
router.register('api/user', UserViewSet, 'user')

urlpatterns = router.urls
