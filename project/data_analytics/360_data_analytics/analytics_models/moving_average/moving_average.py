"""This module is to calculate moving average"""

import logging
import datetime

LOGGER = logging.getLogger('moving_average.py')


def moving_average(data_frame):
    """Calculate moving average from dataframe"""
    LOGGER.info("calculate moving average")
    count_average = data_frame['count'].mean()
    return count_average


def rounder(time):
    """Round to hrs"""
    LOGGER.info("Round time to hr")
    if time.hour == 23:
        return time.replace(second=0, microsecond=0, minute=0, hour=0, day=time.day + 1)

    return time.replace(second=0, microsecond=0, minute=0, hour=time.hour + 1)


def cal_one_hr_moving_average(data_base, directions, intersection_id):
    """This method is to calculate all directions one hour moving average"""
    count_average = {}
    for i in directions:
        # Step 1: Get latest four 'AI' count documents.
        data_frame = data_base.find_latest_4_documents(data_base.get_collection_name(), 'AI', i)
        # Step 2: Calculate Moving average.
        count_average[i] = moving_average(data_frame)
    for i in directions:
        # Step 3: Save back to MongoDB.
        data_base.insert_one_count(data_base.get_collection_name(), i, count_average[i],
                                   rounder(datetime.datetime.now()), 'MA', intersection_id)

