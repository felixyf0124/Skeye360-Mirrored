# References to build this connection
# https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection
from pymongo import MongoClient
import datetime
import logging

logger = logging.getLogger("camera")


class dbConnection:
    # Database Name
    datetimeName = ""

    def __init__(self, databaseName):
        self.datetimeName = databaseName

    def connection(self):
        # Connect to remote mongoDB server
        # client = pymongo.MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
        # Connect to local mongoDB server
        myclient = MongoClient('mongodb://myUserAdmin:abc123@localhost:27017/')
        mydb = myclient[self.datetimeName]
        if mydb is None:
            logger.info("db connection failed")
        else:
            logger.info("db is connected")
        return mydb

    def insertCount(self, collection, counters):
        insersions = 0
        for c in counters:
            new_count = {"direction": c.direction.get_direction(),
                         "count": c.count,
                         "time": c.datetime,
                         "category": "vehicle"}
            insersions = insersions + 1
            collection.insert_one(new_count)
            logger.info("Sending data to db")
        print('insert ' + insersions + 'data.')
