# References to build this connection
# https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection
from pymongo import MongoClient
import datetime
import pandas as pd
import logging

logger = logging.getLogger('dbConnection.py')


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
        myClient = MongoClient('mongodb://%s:%s@%s:%s' % (self.username, self.password, self.host, self.port))
        myDb = myClient[self.datetimeName]
        if myDb is None:
            logger.info("db connection failed")
        else:
            logger.info("db is connected")
        return myDb

    def insert_one(self, collection, direction, count, date_time, count_type, intersection_id_id):
        # Make a query
        newCount = {
            "id": (self._find_latest_id(collection) + 1),
            "direction": direction,
            "count": count,
            "time": date_time,
            "count_type": count_type,
            "intersection_id_id": intersection_id_id
        }
        myDb = self._connect_mongo()
        myDb[collection].insert_one(newCount)

    def insert_mongo(self, collection, counters):
        insersions = 0
        for c in counters:
            newCount = {"direction": c.direction.get_direction(),
                        "count": c.count,
                        "time": c.datetime,
                        "category": "vehicle"}
            insersions = insersions + 1
            collection.insert_one(newCount)
            logger.info("Sending data to db")

    def read_mongo(self, collection, query={}):
        # Make a query to the specific DB and Collection
        mydb = self._connect_mongo()
        cursor = mydb[collection].find(query)

        # Expand the cursor and construct the DataFrame
        df = pd.DataFrame(list(cursor))
        return df

    def _find_latest_id(self, collection):
        # Make a query to the specific DB and Collection
        mydb = self._connect_mongo()
        id = mydb[collection].find().count()
        return id
