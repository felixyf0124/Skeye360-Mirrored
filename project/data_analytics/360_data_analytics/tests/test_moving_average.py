"""This file is to test moving average"""
import unittest
from mongomock import MongoClient as MockMongoClient
import pandas as pd
import datetime
from analytics_models.moving_average.moving_average import rounder, cal_one_hr_moving_average, moving_average


class TestMovingAverage(unittest.TestCase):
    database = None

    def setUp(self):
        self.client = MockMongoClient("mongodb://localhost")
        database = self.client.get_database("360_backend")
        database.create_collection('djangosite_api_count')
        database['djangosite_api_count'].insert_one(
            {"id": 1, "direction": 'WE', "count": 14, "count_type": 'AI', "intersection_id_id": 1})
        database['djangosite_api_count'].insert_one(
            {"id": 2, "direction": 'WE', "count": 15, "count_type": 'AI', "intersection_id_id": 1})
        database['djangosite_api_count'].insert_one(
            {"id": 3, "direction": 'WE', "count": 16, "count_type": 'AI', "intersection_id_id": 1})
        database['djangosite_api_count'].insert_one(
            {"id": 4, "direction": 'WE', "count": 17, "count_type": 'AI', "intersection_id_id": 1})
        self.assertEqual(database['djangosite_api_count'].find_one()['count'], 14)

    def test_rounder_true(self):
        """ This test is to test round function"""
        result = rounder(datetime.datetime(2017, 11, 28, 23, 55, 59, 342380))
        print(result)
        assert datetime.datetime(2017, 11, 29, 0, 0, 0, 0) == result

    def test_rounder_false(self):
        """ This test is to test round function"""
        result = rounder(datetime.datetime(2017, 11, 28, 23, 55, 59, 342380))
        print(result)
        self.assertFalse(datetime.datetime(2017, 11, 28, 0, 0, 0, 0) == result)

    def test_moving_average_true(self):
        # Dictionary of lists
        dict_count = {'count': [90, 40, 80, 98]}
        data_frame = pd.DataFrame(dict_count)
        self.assertEqual(moving_average(data_frame), 77.0)

    def test_moving_average_false(self):
        # Dictionary of lists
        dict_count = {'count': [90, 40, 80, 98]}
        data_frame = pd.DataFrame(dict_count)
        self.assertNotEqual(moving_average(data_frame), 50.0)

    # def test_cal_one_hr_moving_average(self):
    #     self.assertEqual(self.database['djangosite_api_count'].find_one()['count'], 14)


if __name__ == '__main__':
    unittest.main()
