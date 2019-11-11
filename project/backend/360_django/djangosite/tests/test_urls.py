from django.test import SimpleTestCase
# Ref: https://docs.djangoproject.com/en/2.2/ref/urlresolvers/
from django.urls import reverse, resolve
from djangosite_api.views import *
import pytest
import logging


@pytest.mark.django_db
class TestUrls(SimpleTestCase):
    def test_root_url(self):
        logging.info('test_root_url')
        url = reverse('skeye360:api-root')
        print(resolve(url).view_name)
        self.assertEqual(resolve(url).route, '^$')

    # def test_user_url(self):
    #     # client = APIClient(enforce_csrf_checks=True)
    #     url = reverse('skeye360:user-list')
    #     # data = {"username": "123", "password": "123"}
    #     # client.post(url, data)
    #     # response = client.get(url, format='json')
    #     # print(response.data)
    #     # self.assertEqual(response.data, "123")
    #     # self.assertEqual(response.status_code, 200)
    #     self.assertEqual(resolve(url).route, '^api/user/$')

    def test_city_url(self):
        logging.info('test_city_url')
        url = reverse('skeye360:city-list')
        self.assertEqual(resolve(url).route, '^api/city/$')

    def test_district_url(self):
        logging.info('test_district_url')
        url = reverse('skeye360:district-list')
        self.assertEqual(resolve(url).route, '^api/district/$')

    def test_intersction_url(self):
        logging.info('test_intersction_url')
        url = reverse('skeye360:intersection-list')
        self.assertEqual(resolve(url).route, '^api/intersection/$')

    def test_camera_url(self):
        logging.info('test_camera_url')
        url = reverse('skeye360:camera-list')
        self.assertEqual(resolve(url).route, '^api/camera/$')

    def test_userlog_url(self):
        logging.info('test_userlog_url')
        url = reverse('skeye360:userlog-list')
        self.assertEqual(resolve(url).route, '^api/userlog/$')
