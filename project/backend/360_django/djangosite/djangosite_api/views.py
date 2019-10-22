from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.http import HttpResponse
from .models import User
from .serializers import UserSerilizer


# The APIView class for working with class-based views.(need improve)
class StudentDetail(APIView):

    def get_student(self, name):
        print('Get data from student API')
        try:
            return Student.objects.get(name=name)
        except Student.DoesNotExsit:
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, format=None):
        serializer = StudentSerializers(data=request.data)
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
    student_data = User.objects.all()
    for field in student_data:
        print('name of student is', field.age)
    return HttpResponse("check terminal localhost:8000/odm")


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, username, token):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerilizer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerilizer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# For /api purpose
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerilizer
