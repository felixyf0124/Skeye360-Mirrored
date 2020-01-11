from dbConnection import dbConnection

class writeToDatabase:

    def connection(self):
        # To connect to the database
        dbConnect = dbConnection()
        client = dbConnect.connect()
        db = client['mongoDatabase']
        # Collection are table in SQL
        collection = db['Prediction']
        return collection

    def write(self, direction, predictions, time, modelType):
        collection = self.connection()
        # If ran too many times and you want to delete all records (or the whole collection), uncomment the following code
        # collection.remove()

        # START of writing to MongoDB
        # For loop to insert into MongoDB
        for index in range(len(predictions)):
            collection.insert_one({"directions":direction, "count":predictions[index], "time":time[index], "type":modelType})
        # END of writing to MongoDB

    def read(self):
        # START of retrieving data from MongoDB
        print('----------------------------')
        collection = self.connection()
        resultsRaw = collection.find({})
        print(resultsRaw.count())
        # For loop to read in row
        for row in resultsRaw:
            resultDirection = str(row['directions'])
            resultCount = str(row['count'])
            resultTime = str(row['time'])
            resultType = str(row['type'])
            print(resultDirection + " | " + resultCount + " | " + resultTime + " | " + resultType)
        # END of retrieving data from MongoDB