from django.test import TestCase, Client
from django.contrib.auth.models import User


class UserViewTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Sets up data base for testcases
        User.objects.create_user(username="testuser", password="testpassword")
        User.objects.create_user(username="testuser2", password="testpassword")
        User.objects.create_user(username="myuser", password="testpassword")

    # def test_user_view(self):
    #     response = self.client.get(
    #         '/api/user/',
    #         data={"limit": 10}
    #     )
    #     print('response++', response.json())
    #     # user_list = response.json()['user_list']
    #
    #     self.assertIs(response.status_code, 200)
    #     # self.assertEqual(len(user_list), 3)

    def test_userview_inname(self):
        response = self.client.get(
            '/api/user/',
            data={"inname": "testuser", "limit": 10}
        )
        # user_list = response.json()['user_list']

        self.assertIs(response.status_code, 200)
        # self.assertEqual(len(user_list), 2)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
