from django.test import TestCase, Client
from django.contrib.auth.models import User
import json


class UserViewTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Sets up data base for testcases
        User.objects.create_user(id=1, username="test_user", password="test_password")
        User.objects.create_user(id=2, username="test_user2", password="test_password")
        User.objects.create_user(id=3, username="my_user", password="test_password")

    def test_user_view_equal(self):
        response = self.client.get(
            '/api/user/'
        )
        user_list = response.json()
        self.assertIs(response.status_code, 200)
        self.assertEqual(len(user_list), 3)
        self.assertNotEqual(response.status_code, 404)
        self.assertNotEqual(len(user_list), 2)

    def test_one_user_view(self):
        response = self.client.get(
            '/api/user/?id=1',
        )
        user_list = response.json()
        self.assertIs(response.status_code, 200)
        # parse json list to json dic
        json_dic = user_list[0]
        self.assertEqual(json_dic['username'], 'test_user')
        self.assertNotEqual(json_dic['username'], 'test_user2')
        self.assertEqual(len(user_list), 1)
        self.assertNotEqual(response.status_code, 404)
        self.assertNotEqual(len(user_list), 2)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
