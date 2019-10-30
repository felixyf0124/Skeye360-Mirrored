from django.test import SimpleTestCase
# Ref: https://docs.djangoproject.com/en/2.2/ref/urlresolvers/
from django.urls import reverse, resolve

class TestUrls(SimpleTestCase):
    def test_user_url(self):
        assert 1 == 2
