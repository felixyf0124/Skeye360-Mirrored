"""This module help to connect database"""
# References to build this connection
# https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection
import logging
import pandas as pd
from pymongo import MongoClient

LOGGER = logging.getLogger('db_connection.py')


class DBConnection:
    """This class is to help to connect database"""
    database_name = ""
    collection = ""
    username = ""
    password = ""
    host = ""
    port = ""

    def __init__(self, database_name, username, password, host, port):
        self.database_name = database_name
        self.username = username
        self.password = password
        self.host = host
        self.port = port

    def _connect_mongo(self):
        """
        This method is help to connect mongoDB database
        1.Connect to cloud mongoDB server
        For example:
        my_client = MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
        2.Connect to local mongoDB server
        For example:
        my_client = MongoClient('mongodb://myUserAdmin:abc123@localhost:27017/')
        """
        my_client = MongoClient('mongodb://%s:%s@%s:%s' % (self.username, self.password, self.host, self.port))
        my_db = my_client[self.database_name]
        if my_db is None:
            LOGGER.info("db connection failed")
        else:
            LOGGER.info("db is connected")
        return my_db

    def insert_one_count(self, collection, direction, count, date_time, count_type, intersection_id_id):
        """This method is to make a post query and insert one count object to database"""
        new_count = {
            "id": (self._find_latest_id(collection) + 1),
            "count_direction": direction,
            "count": count,
            "time": date_time,
            "count_type": count_type,
            "intersection_id_id": intersection_id_id
        }
        my_db = self._connect_mongo()
        my_db[collection].insert_one(new_count)
        LOGGER.info("Sending one count to db")

    def read_mongo(self, collection, query):
        """This method is to make a get query and get all document from specific collection"""
        my_db = self._connect_mongo()
        cursor = my_db[collection].find(query)

        # Expand the cursor and construct the DataFrame
        data_frame = pd.DataFrame(list(cursor))
        LOGGER.info("Read all documents from collection")
        return data_frame

    def _find_latest_id(self, collection):
        """This method is to make a get query and get latest document id from specific collection"""
        my_db = self._connect_mongo()
        latest_id = my_db[collection].find().count()
        LOGGER.info("find latest id from db")
        return latest_id

    def find_latest_4_documents(self, collection, count_type, count_direction):
        """This method is to make a get query and get latest 4 documents from specific collection"""
        my_db = self._connect_mongo()
        cursor = my_db[collection].find({"count_type": count_type, "count_direction": count_direction}).sort(
            [("time", -1)]).limit(4)
        data_frame = pd.DataFrame(list(cursor))
        LOGGER.info("find latest 4 documents")
        return data_frame

    def get_collection_name(self):
        return self.collection

    def set_collection_name(self, collection_name):
        self.collection = collection_name
