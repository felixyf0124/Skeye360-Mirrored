# reference https://www.w3schools.com/python/python_mongodb_insert.asp

import pymongo
import datetime
from .counter import Counter
import logging
import threading

logger = logging.getLogger("camera")

class Db:

    def connection(self):
        myclient = pymongo.MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
        mydb = myclient["test"]
        mycol = mydb["counts"]
        if mycol is None:
            logger.info("db connection failed")
        else:
            logger.info("db is connected")
        return mycol

    def insert_count(self,collection,counters):
        insersions = 0
        lock = threading.Semaphore(1)
        lock.acquire()
        for c in counters:
            new_count = { "direction": c.direction.get_direction(), 
                "count": c.count, 
                "time": datetime.datetime.utcnow(),
                "category": "vehicle"}
            insersions = insersions + 1
            collection.insert_one(new_count)        
            # logger.info("Sending data to db")
        lock.release()
        return insersions
        

    def find_all_count(self,collection):
        # logger.info("Retrieving data from db")
        collection.find()

    def drop_count(self,collection):
        collection.drop()
        