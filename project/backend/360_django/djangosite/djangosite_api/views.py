from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.http import HttpResponse
from .models import Student
from .serializers import StudentSerializers, StudentSerilizer


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
    student_data = Student.objects.all()
    for field in student_data:
        print('name of student is', field.age)
    return HttpResponse("check terminal localhost:8000/odm")


# The @api_view decorator for working with function based views.

# @api_view(['GET'])
# def api_root(request, format=None):
#     return Response({
#         'users': reverse('user-list', request=request, format=format),
#         'students': reverse('student-list', request=request, format=format)
#     })

# @api_view(['GET', 'POST'])
# def student_list(request, format=None):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         students = Student.objects.all()
#         serializer = StudentSerilizer(students, many=True)
#         return Response(serializer.data)
#
#     elif request.method == 'POST':
#         serializer = StudentSerilizer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, id, format=None):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        student = Student.objects.get(id=id)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerilizer(student)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StudentSerilizer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# For /api purpose
class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerilizer
