import numpy as np
from sklearn.linear_model import LinearRegression

#References
#https://realpython.com/linear-regression-in-python/

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
