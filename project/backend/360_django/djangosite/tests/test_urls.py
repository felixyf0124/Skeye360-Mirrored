from django.test import SimpleTestCase
from rest_framework.test import APIRequestFactory, APITestCase
# Ref: https://docs.djangoproject.com/en/2.2/ref/urlresolvers/
from django.urls import reverse, resolve
from rest_framework import routers

class TestUrls(APITestCase):
    def test_root_url(self):
        url = reverse('skeye360:api-root')
        self.assertEqual(resolve(url).route, '^$')

    factory = APIRequestFactory()
    request = factory.post('/user/', {'username': 'new idea'})

    def test_user_url(self):
        url = reverse('skeye360:user-list')
        data = {"username": "123", "token": "123"}
        self.client.post(url, data)
        response = self.client.get(url, format='json')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(resolve(url).route, '^api/user/$')
