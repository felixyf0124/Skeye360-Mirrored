from dbConnection import client

# CONTINUE WORKING ON CREATING THE DB AND COLLECTION
# THEN INSERT ALL PREDICTIONS AND READ IT

# To connect to the database
db = client['mongoDatabase']
# Collection are table in SQL
collection = db['Prediction']

def write(direction, predictions, time, modelType):
    # If ran too many times and you want to delete all records (or the whole collection), uncomment the following code
    # collection.remove()
    # START of writing to MongoDB
    # For loop to insert into MongoDB
    for index in range(len(predictions)):
        collection.insert_one({"directions":direction, "count":predictions[index], "time":time[index], "type":modelType})
    # END of writing to MongoDB

def read(collectionName):
    # START of retrieving data from MongoDB
    print('----------------------------')
    collectionData = db[collectionName]
    resultsRaw = collectionData.find({})
    print(resultsRaw.count())
    for row in resultsRaw:
        resultDirection = str(row['directions'])
        resultCount = str(row['count'])
        resultTime = str(row['time'])
        resultType = str(row['type'])
        print(resultDirection + " | " + resultCount + " | " + resultTime + " | " + resultType)
    # END of retrieving data from MongoDB