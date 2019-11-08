# reference https://www.w3schools.com/python/python_mongodb_insert.asp

import pymongo
import datetime
from .counter import Counter

class Db:

    def connection(self):
        myclient = pymongo.MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
        mydb = myclient["test"]
        mycol = mydb["counts"]
        return mycol

    def insert_count(self,collection,counters):
        insersions = 0
        for c in counters:
            new_count = { "direction": c.direction.get_direction(), 
                "count": c.count, 
                "time": datetime.datetime.utcnow(),
                "category": "vehicle"}
            insersions = insersions + 1
            collection.insert_one(new_count)
        return insersions
        

    def find_all_count(self,collection):
        print("++++++++++++")
        for x in collection.find():
            print(x)
        print("++++++++++++")

    def drop_count(self,collection):
        collection.drop()
        