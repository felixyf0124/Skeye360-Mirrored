#References to build this connection
#https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection
from pymongo import MongoClient
from pprint import pprint
#client = MongoClient()

# Connect to remote mongoDB server
# client = pymongo.MongoClient("mongodb://myUserAdmin:abc123@40.121.23.48:8300/")
# Connect to local mongoDB server
client = MongoClient('mongodb://myUserAdmin:abc123@localhost:27017/')
# Link with server
db = client.admin
# Issue the serverStatus command and print the results
serverStatusResult = db.command("serverStatus")
pprint(serverStatusResult)