import mongomock
import unittest
import numpy as np
from analytics_models.arima.writeToDatabase import writeToDatabase 


class test_writeToDatabase(unittest.TestCase):
    # Data setup
    direction = "EW"
    predictions = np.ndarray(shape=(1), buffer=np.array(['62.49457301', '61.77780322']))
    time = ['1999-06-20 00:00:00', '1999-06-21 00:00:00']
    modelType = "arima"


    def test_write(self):
        # Mock the collection
        collectionMock = mongomock.MongoClient().db.collection

        # Create writeToDatabase object and call write method
        wtd = writeToDatabase()
        listOfInsertedID = wtd.write(self.direction, 
        self.predictions, 
        self.time, 
        self.modelType, 
        collectionMock)

        # counter to count every id that exists in the database
        counter = 0
        # Check if all id exists in the database
        for id in listOfInsertedID:
            if(collectionMock.find_one({'_id': id})):
                counter += 1

        # Compare the number of ids with the ids that exist in the database
        numOfID = len(listOfInsertedID)
        self.assertEqual(counter, numOfID)

    def test_read(self):
        """ test_read should pass """
        # Mock the collection
        collectionMock = mongomock.MongoClient().db.collection

        # Create writeToDatabase object and call write method
        wtd = writeToDatabase()
        wtd.write(self.direction, self.predictions, self.time, self.modelType, collectionMock)
        listOfResults = wtd.read(collectionMock)

        # counter to count every id that exists in the database
        counter = 0
        # index is the index number in the for loop
        index = 0
        # Check if all id exists in the database
        for result in listOfResults:
            if(result == (self.direction + " | " + 
            str(self.predictions[index]) + " | " + 
            self.time[index] + " | " + 
            self.modelType)):
                counter += 1
            index += 1

        # Compare the number of ids with the ids that exist in the database
        numOfResults = len(listOfResults)
        self.assertEqual(counter, numOfResults)





    