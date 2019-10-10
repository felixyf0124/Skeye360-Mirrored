# reference https://www.w3schools.com/python/python_mongodb_insert.asp

import pymongo
import datetime
from .counter import Counter

def connection():
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["dB"]
    mycol = mydb["counts"]
    return mycol

def insert_count(collection,count):
    new_count = { "direction": "N->S", 
        "count": count.get_counter(), 
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
    