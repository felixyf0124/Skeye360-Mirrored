# References to build this connection
# https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection
from pymongo import MongoClient
import datetime
import pandas as pd
import logging

logger = logging.getLogger("camera")


class dbConnection:
    datetimeName = ""
    username = ""
    password = ""
    host = ""
    port = ""

    def __init__(self, databaseName, username, password, host, port):
        self.datetimeName = databaseName
        self.username = username
        self.password = password
        self.host = host
        self.port = port

    def _connect_mongo(self):
        # Connect to remote mongoDB server
        # client = pymongo.MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
        # Connect to local mongoDB server
        # myclient = MongoClient('mongodb://myUserAdmin:abc123@localhost:27017/')
        myclient = MongoClient('mongodb://%s:%s@%s:%s' % (self.username, self.password, self.host, self.port))
        mydb = myclient[self.datetimeName]
        if mydb is None:
            logger.info("db connection failed")
        else:
            logger.info("db is connected")
        return mydb

    def insert_mongo(self, collection, counters):
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

    def read_mongo(self, collection, query={}):
        # Make a query to the specific DB and Collection
        mydb = self._connect_mongo()
        cursor = mydb[collection].find(query)

        # Expand the cursor and construct the DataFrame
        df = pd.DataFrame(list(cursor))
        return df
