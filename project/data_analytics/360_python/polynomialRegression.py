#References to create the Polynomial Regression
#https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html
#https://www.geeksforgeeks.org/python-implementation-of-polynomial-regression/
from dbConnection import client
import numpy as np
import matplotlib.pyplot as matplot 
from sklearn.preprocessing  import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Day of the month
date = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).reshape((-1, 1))
# Average time to cross one intersection to the other at a specific time
avgTime = np.array([2, 2.3, 2.2, 2.5, 2.6, 2.5, 2.5, 2.8, 2.9, 2.4, 2.5, 2.7, 2.6, 2.8]).reshape((-1, 1))

# Use Polynomial Regression to fit into the dataset
polynomial = PolynomialFeatures(degree= 2)
x = polynomial.fit_transform(date)
polynomial.fit(x, avgTime)
line = LinearRegression()
line.fit(x, avgTime)

# View the Polynomial Regression on a chart
matplot.scatter(date, avgTime, color='green')
matplot.plot(date, line.predict(polynomial.fit_transform(date)), color='green')
matplot.title('Testing Polynomial Regression (Traffic)')
matplot.xlabel('Date')
matplot.ylabel('Average Time')
matplot.show()

# New result of Polynomial Regression prediction
# The following predicts for 2 weeks
predictions = line.predict(polynomial.fit_transform(date))
print(predictions)

# print(predictions[0][0])
# print(len(predictions))

# To connect to the database
# db = client['mongoDatabase']
# Collection are table in SQL
# collection = db['predictions']
# For loop to insert into MongoDB
# for index in range(len(predictions)):
#     collection.insert_one({"date":date[index], "prediction":predictions[index][0]})

# START of retrieving data from MongoDB
# print('----------------------------')
# resultsRaw = collection.find({})
# for row in resultsRaw:
#     resultDate = str(row['date'])
#     resultAvgTime = str(row['avgTime'])
#     print(resultDate + " : " + resultAvgTime)
# END of retrieving data from MongoDB



