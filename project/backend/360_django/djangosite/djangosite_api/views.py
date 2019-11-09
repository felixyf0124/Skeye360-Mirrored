from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions, filters, generics
from django.http import HttpResponse
from knox.models import AuthToken
from .models import *
from .serializers import *

# For /api purpose
class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = AccountSerializer

    def get_queryset(self):
        return self.request.user.account.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })
    
# Get User API

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    # How to use filter:https://www.youtube.com/watch?v=s9V9F9Jtj7Q
    filter_fields = ('city_name',)


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    filter_fields = ('district_name',)


class IntersectionViewSet(viewsets.ModelViewSet):
    queryset = Intersection.objects.all()
    serializer_class = IntersectionSerializer
    filter_fields = ('intersection_name',)


class TrafficLightViewSet(viewsets.ModelViewSet):
    queryset = Trafficlight.objects.all()
    serializer_class = TrafficLightSerializer


class CountViewSet(viewsets.ModelViewSet):
    queryset = Count.objects.all()
    serializer_class = CountSerializer


class TimeViewSet(viewsets.ModelViewSet):
    queryset = Time.objects.all()
    serializer_class = TimeSerializer


class PredictionViewSet(viewsets.ModelViewSet):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class PedestrianViewSet(viewsets.ModelViewSet):
    queryset = Pedestrian.objects.all()
    serializer_class = PedestrianSerializer


class UserlogViewSet(viewsets.ModelViewSet):
    queryset = Userlog.objects.all()
    serializer_class = UserlogSerializer
    filter_fields = ('user_id',)


class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer
