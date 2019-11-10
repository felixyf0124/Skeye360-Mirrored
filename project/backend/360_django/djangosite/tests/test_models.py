from django.test import TestCase
from mixer.backend.django import mixer
import pytest


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

    def test_false_is_false(self):
        print("Method: test_false_is_false.")
        self.assertFalse(False)

    def test_false_is_true(self):
        print("Method: test_false_is_true.")
        self.assertTrue(True)

    def test_one_plus_one_equals_two(self):
        print("Method: test_one_plus_one_equals_two.")
        self.assertEqual(2, 2)

    def test_intersection(self):
        # Test value
        intersection1 = mixer.blend('djangosite_api.Intersection', intersection_name='Guy')
        self.assertEqual(intersection1.intersection_name, 'Guy')
        intersection2 = mixer.blend('djangosite_api.Intersection', intersection_name='Dupuis')
        self.assertEqual(intersection2.intersection_name, 'Dupuis')
        self.assertNotEqual(intersection2.intersection_name, 'Guy')
