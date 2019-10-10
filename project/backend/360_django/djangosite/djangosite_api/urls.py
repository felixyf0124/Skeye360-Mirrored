from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

# from .views import api_root

urlpatterns = [
    # path('', api_root),
    #path('students-view/', views.student_list),
    path('<int:id>', views.student_detail),
    # path('student-view/<int:id>/', student_detail, name='student_detail'),
    path('odm', views.home, name='home'),
]

# urlpatterns = format_suffix_patterns([
# ])

# For auto format by . (EX: 0.0.0.0:8000/students/students-view.json)
urlpatterns = format_suffix_patterns(urlpatterns)
