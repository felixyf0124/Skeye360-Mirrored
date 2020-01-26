#References to create the linear regression and storing/retrieving data from MongoDB
#https://realpython.com/linear-regression-in-python/
#https://realpython.com/introduction-to-mongodb-and-python/#establishing-a-connection

from dbConnection import client
import numpy as np
from sklearn.linear_model import LinearRegression

# Day of the month
date = np.array([1, 2, 3, 4, 5]).reshape((-1, 1))
# Average time to cross one intersection to the other at a specific time
avgTime = np.array([2, 2.3, 2.2, 3, 2.6])

# To train the model
model = LinearRegression().fit(date, avgTime)

# To get the coefficient of determination
coefficient = model.score(date, avgTime)

# Prediction
avgTimePrediction = model.predict(date)
print(avgTimePrediction)

# To connect to the database
db = client['mongoDatabase']
# Collection are table in SQL
collection = db['AverageCrossTime']

# START of inserting data to MongoDB
data1 = {
    'date': 1,
    'avgTime': '2.8'
}
data2 = {
    'date': 2,
    'avgTime': '2.5'
}
data3 = {
    'date': 3,
    'avgTime': '3.1'
}
data4 = {
    'date': 4,
    'avgTime': '2.6'
}
data5 = {
    'date': 5,
    'avgTime': '2.8'
}
results = collection.insert_many([data1, data2, data3, data4, data5])
# One of the ways to show that the data have been inserted
print('Inserted Data: {0}'.format(results.inserted_ids))
# END of inserting data to MongoDB

# START of retrieving data from MongoDB
print('----------------------------')
resultsRaw = collection.find({})
listAvgTime = list()
listDate = list()
for row in resultsRaw:
    # Have to use the str() function, else the letter u' will show up
    resultAvgTime = str(row['avgTime'])
    resultDate = str(row['date'])
    listAvgTime.append(resultAvgTime)
    listDate.append(resultDate)
    print(resultDate + " : " + resultAvgTime)
# END of retrieving data from MongoDB
