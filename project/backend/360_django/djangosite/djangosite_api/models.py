from django.db import models

# Create your models here.
# For testing purpose
class Student(models.Model):
    name = models.CharField(max_length=20, null=True)
    age = models.IntegerField(default=10, null=True)
    roll_number = models.CharField(max_length=20, null=True)

    def __str__(self):
        return self.name