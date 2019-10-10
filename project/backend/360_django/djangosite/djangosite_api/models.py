from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

# The following is the example you can use
# LEXERS = [item for item in get_all_lexers() if item[1]]
# LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
# STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])


class Student(models.Model):
    name = models.CharField(max_length=20, null=True)
    age = models.IntegerField(default=10, null=True)
    roll_number = models.CharField(max_length=20, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    # language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    # style = models.CharField(choices=STYLE_CHOICES, default='friendly', max_length=100)
    # code = models.TextField()
    # linenos = models.BooleanField(default=False)
