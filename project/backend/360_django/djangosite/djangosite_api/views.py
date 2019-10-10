from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from .models import Student
from .serializers import StudentSerializer

class StudentAPI(APIView):
    def get(self, request, format=None):
        student_data = Student.objects.all()
        serializer = StudentSerializer(student_data, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            age = serializer.validated_data.get('age')
            roll_number = serializer.validated_data('roll_number')
            message = f'Hello {name}{age}{roll_number}'
            serializer.save()
            return Response(serializer.data, {'message': message})
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request, pk=None):
        return Response({'method': 'PUT'})

    def patch(self, request, pk=None):
        return Response({'method': 'PATCH'})

    def delete(self, request, pk=None):
        return Response({'method': 'DELETE'})


# For testing purpose
def home(request):
    student_data = Student.objects.all()
    for field in student_data:
        print('name of student is', field.age)
    return HttpResponse("check terminal localhost:8000/odm")
