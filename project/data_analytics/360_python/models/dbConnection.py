#References to build this connection
#https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection

from pymongo import MongoClient
client = MongoClient()

# To change the localhost:27017 to the actual IP:PORT
client = MongoClient('mongodb://localhost:27017')