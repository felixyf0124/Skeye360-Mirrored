from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from djangosite_api import serializers
from django.http import HttpResponse
from .models import Student 


# Create your views here.

class HelloWorld(APIView):
    def get(self, request):
        student_data = Student.objects.all()
        for field in student_data:
            print('name of student is', field.name)
        return Response({'name of student is', field.name})


    def post(self, request):
        """Create a hello message with our name"""
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            message = f'Hello {name}'
            return Response({'message': message})
        else:
            return Response(
                serializer.errors,
                status = status.HTTP_400_BAD_REQUEST
            )

    
    def put(self, request, pk=None):
        return Response({'method':'PUT'})

    
    def patch(self, request, pk=None):
        return Response({'method':'PATCH'})

    
    def delete(self, request, pk=None):
        return Response({'method':'DELETE'})

# For testing purpose
def home(request):
    student_data = Student.objects.all()
    for field in student_data:
        print('name of student is', field.age)
    return HttpResponse("check terminal localhost:8000/odm")

