#Referemce: Based on arima from Towardsdatascience to build the model:
# https://towardsdatascience.com/machine-learning-part-19-time-series-and-autoregressive-integrated-moving-average-model-arima-c1005347b0d7

import numpy as np
import pandas as panda
from matplotlib import pyplot as matplot
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

# Creates my own data, could have a csv file in the future
# Day of the month
date = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).reshape((-1, 1))
# Average time to cross one intersection to the other at a specific time
avgTime = np.array([2, 2.3, 2.2, 2.5, 2.6, 2.5, 2.5, 2.8, 2.9, 2.4, 2.5, 2.7, 2.6, 2.8]).reshape((-1, 1))

# Puts my two arrays in a DataFrame
dataFrame = panda.DataFrame(avgTime, date)

# Creates labels for the graph
matplot.xlabel('Date')
matplot.ylabel('Number of cars')

# Draws the graph with the data given
matplot.plot(dataFrame)

# Calculates the rolling mean and standard deviation
rolling_mean = dataFrame.rolling(4).mean()
rolling_std = dataFrame.rolling(4).std()

# Draws the graph with the given data
matplot.plot(dataFrame, color = 'blue', label = 'Original')
matplot.plot(rolling_mean, color = 'red', label = 'Rolling Mean')
matplot.plot(rolling_std, color = 'black', label = 'Rolling Std')

# loc means the location of the legend, if best, then it will place 
# it in the best position to minimize the overlapping
matplot.legend(loc = 'best')

matplot.title('Rolling Mean & Rolling Standard Deviation')

# .show() means to show the graph, else it won't be dislayed to the use
matplot.show()