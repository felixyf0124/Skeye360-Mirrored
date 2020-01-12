import json
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions, filters, generics
from django.http import HttpResponse
from knox.models import AuthToken
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout


# For /api purpose


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            raw_data = json.loads(request.body)

            username = raw_data['username']
            password = raw_data['password']

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            created_user = User.objects.create_user(
                username=username, password=password)

            created_user.save()

            user = authenticate(request, username=username, password=password)
            login(request, user)

            return JsonResponse({'username': username, 'user_id': user.id}, status=201)

        except BaseException as error:
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)


# User login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            raw_data = json.loads(request.body)
            username = raw_data['username']
            password = raw_data['password']

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse({'username': username, 'user_id': user.id}, status=200)

            return JsonResponse({'error': 'Wrong username and/or password'}, status=400)

        except BaseException as error:
            print(str(error))
            return JsonResponse({'error': repr(error)}, status=400)


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
    filter_fields = ('count_type', 'time',)


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
