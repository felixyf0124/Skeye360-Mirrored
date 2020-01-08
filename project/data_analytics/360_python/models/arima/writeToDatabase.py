from ..dbConnection import client

# CONTINUE WORKING ON CREATING THE DB AND COLLECTION
# THEN INSERT ALL PREDICTIONS AND READ IT

# To connect to the database
db = client['mongoDatabase']
# Collection are table in SQL
collection = db['Prediction']

def write(direction, predictions, time, modelType):
    # START of writing to MongoDB
    # For loop to insert into MongoDB
    for index in range(len(predictions)):
        collection.insert_one({"directions":direction, "count":predictions[index][0], "time":time[index][0], "type":modelType})
    # END of writing to MongoDB

def read(collection):
    # START of retrieving data from MongoDB
    print('----------------------------')
    resultsRaw = collection.find({})
    for row in resultsRaw:
        resultDirection = str(row['direction'])
        resultCount = str(row['count'])
        resultTime = str(row['time'])
        resultType = str(row['type'])
        print(resultDirection + " | " + resultCount + " | " + resultTime + " | " + resultType)
    # END of retrieving data from MongoDB