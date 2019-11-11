from django.test import TestCase
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
    def test_intersection(self):
        logging.info('test_intersection')
        # Test post request
        data1 = {'intersection_name': 'Guy'}
        data2 = {'intersection_name': 'Dupuis'}
        # Test post request
        intersection1 = self.client.post('/api/intersection/', data1)
        intersection2 = self.client.post('/api/intersection/', data2)
        self.assertEqual(intersection1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(intersection2.status_code, status.HTTP_201_CREATED)
        # Test get request
        response = self.client.get('/api/intersection/?intersection_name=Guy')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Two intersection should return 2
        response = self.client.get('/api/intersection/')
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1].get('intersection_name'), 'Dupuis')
        self.assertNotEqual(response.data[1].get('intersection_name'), 'Guy')
        # Test intersection name duplication
        form_data = {"intersection_name": "Guy"}
        response = self.client.post('/api/intersection/', form_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_camera(self):
    #     logging.info('test_camera')
    #     # Test post request
    #     data1 = {'camera_url': '192.168.0.1'}
    #     data2 = {'camera_url': '192.168.0.2'}
    #     camera1 = self.client.post('/api/camera', data1)
    #     camera2 = self.client.post('/api/camera', data2)
    #     self.assertEqual(camera1.status_code, status.HTTP_301_MOVED_PERMANENTLY)
    #     self.assertEqual(camera2.status_code, status.HTTP_301_MOVED_PERMANENTLY)
    #     # Test get request
    #     response = self.client.get('/api/camera/')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     # Two intersection should return 2
    #     self.assertEqual(len(response.data), 2)
    #     self.assertEqual(response.data[1].get('camera_url'), '192.168.0.2')
    #     self.assertNotEqual(response.data[1].get('camera_url'), '192.168.0.1')
    #     # Test intersection name duplication
    #     form_data = {"intersection_name": "Guy"}
    #     response = self.client.post('/api/camera/', form_data)
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #
    # def test_distinct(self):
    #     logging.info('test_distinct')
    #     # Test post request
    #     data1 = {'district_name': 'Montreal_East'}
    #     data2 = {'district_name': 'Montreal_West'}
    #     district1 = self.client.post('/api/district', data1)
    #     district2 = self.client.post('/api/district', data2)
    #     self.assertEqual(district1.status_code, status.HTTP_301_MOVED_PERMANENTLY)
    #     self.assertEqual(district2.status_code, status.HTTP_301_MOVED_PERMANENTLY)
    #     # Test get request
    #     response = self.client.get('/api/district/')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     # Two intersection should return 2
    #     self.assertEqual(len(response.data), 2)
    #     self.assertEqual(response.data[1].get('district_name'), 'Montreal_West')
    #     self.assertNotEqual(response.data[1].get('district_name'), 'Montreal_East')
    #     # Test intersection name duplication
    #     form_data = {"intersection_name": "Guy"}
    #     response = self.client.post('/api/district/', form_data)
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
