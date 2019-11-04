# reference https://www.w3schools.com/python/python_mongodb_insert.asp

import pymongo
import datetime
from .counter import Counter

def connection():
    myclient = pymongo.MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
    mydb = myclient["test"]
    mycol = mydb["counts"]
    return mycol

def insert_count(collection,counters):
    for c in counters:
        new_count = { "direction": c.direction.get_direction(), 
            "count": c.count, 
            "time": datetime.datetime.utcnow(),
            "category": "vehicle"}
        collection.insert_one(new_count)

def find_all_count(collection):
    print("++++++++++++")
    for x in collection.find():
        print(x)
    print("++++++++++++")

def drop_count(collection):
    collection.drop()
    