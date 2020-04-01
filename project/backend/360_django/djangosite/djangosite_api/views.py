import json
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions, generics
from django_filters import rest_framework as filters
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
from django_filters.rest_framework import DjangoFilterBackend


# For /api purpose
# Ref: https://docs.djangoproject.com/en/3.0/topics/auth/default/
# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    # fix django.request.log_response: Method Not Allowed:
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            email = request.data.get('email')
            if (request.data.get('is_staff') is True or request.data.get('is_staff') == 'true'):
                is_staff = True
            else:
                is_staff = False

            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'})

            created_user = User.objects.create_user(
                username=username, password=password, email=email, is_staff=is_staff)

            created_user.save()

            user = authenticate(username=username, password=password)
            login(request, user)
            return JsonResponse({'username': username, 'user_id': user.id, 'is_staff': user.is_staff}, status=201)

        except BaseException as error:
            print(repr(error))
            return JsonResponse({'error': repr(error)}, status=400)


# User login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    # fix django.request.log_response: Method Not Allowed:
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            # return a list
            username = request.data.get("username")
            password = request.data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse(
                    {'username': username, 'user_id': user.id, 'is_staff': user.is_staff},
                    status=200)

            return JsonResponse({'error': 'Wrong username and/or password'}, status=400)

        except BaseException as error:
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


# Ref: https://sam.hooke.me/note/2019/07/migrating-from-tastypie-to-django-rest-framework/
class CountFilter(filters.FilterSet):
    time = filters.IsoDateTimeFilter(field_name='time')
    timestamp__lte = filters.IsoDateTimeFilter(field_name="time", lookup_expr="lte")
    timestamp__gte = filters.IsoDateTimeFilter(field_name="time", lookup_expr="gte")

    class Meta:
        model = Count
        fields = ['count_type', 'count_direction', 'intersection_id']


class CountViewSet(viewsets.ModelViewSet):
    queryset = Count.objects.all()
    serializer_class = CountSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = CountFilter


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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_fields = ('id', 'is_staff')
