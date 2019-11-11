from django.test import SimpleTestCase
# Ref: https://docs.djangoproject.com/en/2.2/ref/urlresolvers/
from django.urls import reverse, resolve
from djangosite_api.views import *


class TestUrls(SimpleTestCase):
    def test_root_url(self):
        url = reverse('skeye360:api-root')
        self.assertEqual(resolve(url).route, '^$')

    # factory = APIRequestFactory()
    # request = factory.post('/user/', {'username': 'new idea'})
    # print(request.body)

    def test_city_url(self):
        url = reverse('skeye360:city-list')
        self.assertEqual(resolve(url).route, '^api/city/$')

    def test_district_url(self):
        url = reverse('skeye360:district-list')
        self.assertEqual(resolve(url).route, '^api/district/$')

    def test_intersction_url(self):
        url = reverse('skeye360:intersection-list')
        self.assertEqual(resolve(url).route, '^api/intersection/$')

    def test_camera_url(self):
        url = reverse('skeye360:camera-list')
        self.assertEqual(resolve(url).route, '^api/camera/$')

    def test_userlog_url(self):
        url = reverse('skeye360:userlog-list')
        self.assertEqual(resolve(url).route, '^api/userlog/$')
