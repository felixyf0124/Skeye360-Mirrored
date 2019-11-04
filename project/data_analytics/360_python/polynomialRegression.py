#References to create the Polynomial Regression
#https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html
#https://www.geeksforgeeks.org/python-implementation-of-polynomial-regression/
from dbConnection import client
import numpy as np
import matplotlib.pyplot as matplot 
from sklearn.preprocessing  import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Day of the month
date = np.array([1, 2, 3, 4, 5]).reshape((-1, 1))
# Average time to cross one intersection to the other at a specific time
avgTime = np.array([2, 2.3, 2.2, 3, 2.6])

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
line.predict(polynomial.fit_transform(110.0))



