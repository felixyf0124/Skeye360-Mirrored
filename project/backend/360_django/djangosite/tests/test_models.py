from django.test import TestCase
from django.contrib.auth.models import User
from mixer.backend.django import mixer
from rest_framework import status
import pytest
import logging


# Create your tests here.


@pytest.mark.django_db
class YourTestClass(TestCase):
    @classmethod
    def setUpTestData(cls):
        print("setUpTestData: Run once to set up non-modified data for all class methods.")
        pass

    def setUp(self):
        print("setUp: Run once for every test method to setup clean data.")
        pass

    # For mixer: https://github.com/klen/mixer
    def test_district(self):
        logging.info('test_distinct')
        # Test post request
        district1 = mixer.blend('djangosite_api.District', district_name='Montreal_East', id=1)
        self.assertEqual(district1.district_name, 'Montreal_East')
        district2 = mixer.blend('djangosite_api.District', district_name='Montreal_West', id=2)
        self.assertEqual(district2.district_name, 'Montreal_West')
        # Test get request
        response = self.client.get('/api/district/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Two intersection should return 2
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1].get('district_name'), 'Montreal_West')
        self.assertNotEqual(response.data[1].get('district_name'), 'Montreal_East')
        # Test intersection name duplication
        form_data = {"intersection_name": "Guy"}
        response = self.client.post('/api/district/', form_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_intersection(self):
        logging.info('test_intersection')
        # Create district
        district = mixer.blend('djangosite_api.District', district_name='Montreal_East', id=1)
        user1 = User.objects.create_user(id=1, username="test_user_1", password="test_password")
        user2 = User.objects.create_user(id=2, username="test_user_2", password="test_password")
        # Test post request
        intersection1 = mixer.blend('djangosite_api.Intersection', intersection_name='Guy', district_id=district,
                                    user_id=user1, id=1)
        self.assertEqual(intersection1.intersection_name, 'Guy')
        intersection2 = mixer.blend('djangosite_api.Intersection', intersection_name='Dupuis', district_id=district,
                                    user_id=user2, id=2)
        self.assertEqual(intersection2.intersection_name, 'Dupuis')
        # Test get request
        response = self.client.get('/api/intersection/?intersection_name=Guy')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Two intersection should return 2
        response = self.client.get('/api/intersection/')
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1].get('intersection_name'), 'Dupuis')
        self.assertNotEqual(response.data[1].get('intersection_name'), 'Guy')

    def test_camera(self):
        logging.info('test_camera')
        # Create distinct
        district = mixer.blend('djangosite_api.District', district_name='Montreal_East', id=1)
        # Create intersection
        intersection = mixer.blend('djangosite_api.Intersection', intersection_name='Guy', district_id=district, id=1)
        # Test post request
        camera1 = mixer.blend('djangosite_api.Camera', camera_url='192.168.0.1', intersection_id=intersection, id=1)
        self.assertEqual(camera1.camera_url, '192.168.0.1')
        camera2 = mixer.blend('djangosite_api.Camera', camera_url='192.168.0.2', intersection_id=intersection, id=2)
        self.assertEqual(camera2.camera_url, '192.168.0.2')
        # Test get request
        response = self.client.get('/api/camera/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Two intersection should return 2
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1].get('camera_url'), '192.168.0.2')
        self.assertNotEqual(response.data[1].get('camera_url'), '192.168.0.1')

    def test_count(self):
        logging.info('test_count')
        # Create distinct
        district = mixer.blend('djangosite_api.District', district_name='Montreal_East', id=1)
        # Create intersection
        intersection = mixer.blend('djangosite_api.Intersection', intersection_name='Guy', district_id=district, id=1)
        # Test post request
        count1 = mixer.blend('djangosite_api.Count', count_type='MA', count_direction='NW', count=6,
                             intersection_id=intersection, id=1)
        count2 = mixer.blend('djangosite_api.Count', count_type='MA', count_direction='SE', count=9,
                             intersection_id=intersection, id=2)
        self.assertEqual(count1.count, 6)
        # Test get request
        response = self.client.get('/api/intersection/?count_type=MA')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Two intersection should return 2
        response = self.client.get('/api/count/')
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1].get('count'), 9)
        self.assertNotEqual(response.data[1].get('count'), 6)
