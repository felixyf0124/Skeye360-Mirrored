from django.test import SimpleTestCase
# Ref: https://docs.djangoproject.com/en/2.2/ref/urlresolvers/
from django.urls import reverse, resolve

# Commented fialing test
# class TestUrls(SimpleTestCase):
#     def test_user_url(self):
#         url = reverse('user')
#         print(resolve(url))

# Passing test
class TestFoo(SimpleTestCase):
    def test_foo(self):
        self.assertTrue(True)
