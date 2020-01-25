import pandas as panda

class writeToDatabase:

    def connection(self, databaseName, collectionName, dbClient):
        # db = client['360backend']
        db = dbClient[databaseName]
        # Collection are table in SQL
        # collection = db['djangosite_api_count']
        collection = db[collectionName]
        return collection

    def write(self, direction, predictions, time, modelType, intersectionID, collection):
        # If ran too many times and you want to delete all records (or the whole collection), uncomment the following code
        # collection.remove()

        # START of writing to MongoDB
        # The following code is to get the latest id inserted
        resultsRaw = collection.find({})
        lastId = resultsRaw.count()

        listInsertedID = list()
        # For loop to insert into MongoDB
        for index in range(len(predictions)):
            insertedID = collection.insert_one({"id": lastId + index, "count_direction":direction, "count":predictions[index], "time":time[index], "intersection_id_id":intersectionID, "count_type":modelType}).inserted_id
            listInsertedID.append(insertedID)
        return listInsertedID
        # END of writing to MongoDB

    def read(self, collection):
        # START of retrieving data from MongoDB
        print('----------------------------')
        resultsRaw = collection.find({})
        
        # Uncomment the following line of codes to see the number of records
        # print(resultsRaw.count())
        
        results = list()

        # For loop to read in row
        for row in resultsRaw:
            # Extracts data by column name
            resultDirection = str(row["count_direction"])
            resultCount = str(row['count'])
            resultTime = str(row['time'])
            resultType = str(row['count_type'])
            resultIntersectionID = str(row['intersection_id_id'])
            # Prepare the results and print it
            result = resultDirection + " | " + resultCount + " | " + resultTime + " | " + resultIntersectionID + " | " + resultType 
            # print(result)
            # Add the result to a list
            results.append(result)
        
        # If ran too many times and you want to delete all records (or the whole collection), uncomment the following code
        # collection.remove()
        return results
        # END of retrieving data from MongoDB