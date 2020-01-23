from dbConnection import dbConnection
import pandas as panda

class writeToDatabase:

    def connection(self):
        # To connect to the database
        dbConnect = dbConnection()
        client = dbConnect.connect()
        db = client['360backend']
        # Collection are table in SQL
        collection = db['djangosite_api_count']
        return collection

    def write(self, direction, predictions, time, modelType):
        collection = self.connection()
        # If ran too many times and you want to delete all records (or the whole collection), uncomment the following code
        collection.remove()

        # START of writing to MongoDB
        # The following code is to get the latest id inserted
        resultsRaw = collection.find({})
        lastId = resultsRaw.count()
        # For loop to insert into MongoDB
        for index in range(len(predictions)):
            collection.insert_one({"id": lastId + index, "count_direction":direction, "count":predictions[index], "time":time[index], "count_type":modelType})
        # END of writing to MongoDB

    def read(self):
        # START of retrieving data from MongoDB
        print('----------------------------')
        collection = self.connection()
        resultsRaw = collection.find({})
        
        # Uncomment the following line of codes to see the number of records
        # print(resultsRaw.count())
        
        # For loop to read in row
        for row in resultsRaw:
            resultDirection = str(row["count_direction"])
            resultCount = str(row['count'])
            resultTime = str(row['time'])
            resultType = str(row['count_type'])
            print(resultDirection + " | " + resultCount + " | " + resultTime + " | " + resultType)
        # END of retrieving data from MongoDB