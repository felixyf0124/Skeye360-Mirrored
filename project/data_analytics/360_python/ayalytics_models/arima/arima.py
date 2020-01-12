#Referemce: Based on arima from Towardsdatascience to build the model:
# https://towardsdatascience.com/machine-learning-part-19-time-series-and-autoregressive-integrated-moving-average-model-arima-c1005347b0d7

import numpy as np
import pandas as panda
from adfullerResults import printResults
from matplotlib import pyplot as matplot
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima_model import ARIMA

# Creates my own data, could have a csv file in the future
# Day of the month
# date = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]).reshape((-1, 1))
date = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
# Average time to cross one intersection to the other at a specific time
# numberOfCars = np.array([20, 23, 22, 25, 26, 25, 25, 28, 29, 24, 25, 27, 26, 28]).reshape((-1, 1))
numberOfCars = [20, 23, 22, 25, 26, 25, 25, 28, 29, 24, 25, 27, 26, 28]

# Puts my two arrays in a DataFrame
# dataFrame = panda.DataFrame(numberOfCars, date)
dataFrame = panda.DataFrame()
# dataFrame['date'] = date
dataFrame['numberOfCars'] = numberOfCars

# Creates labels for the graph
matplot.xlabel('Date')
matplot.ylabel('Number of cars')

# Draws the graph with the data given
# matplot.plot(dataFrame)


# Method to calculate the rolling mean and standard deviation
# and then plot it to allow us to visualize
# and finally to test if it is stationary or not
def plotAndTest(timeseriesData):
    # Calculates the rolling mean and standard deviation
    rolling_mean = timeseriesData.rolling(4).mean()
    rolling_std = timeseriesData.rolling(4).std()

    # Draws the graph with the given data
    matplot.plot(timeseriesData, color = 'blue', label = 'Original')
    matplot.plot(rolling_mean, color = 'red', label = 'Rolling Mean')
    matplot.plot(rolling_std, color = 'black', label = 'Rolling Std')

    # loc means the location of the legend, if best, then it will place 
    # it in the best position to minimize the overlapping
    matplot.legend(loc = 'best')

    matplot.title('Rolling Mean & Rolling Standard Deviation')

    # .show() means to show the graph, else it won't be dislayed to the use
    matplot.show()

    # The code below gives out values, which are used to determine if it stationary or not
    # printResults function is calling another file called adfullerResults.py
    printResults(timeseriesData['numberOfCars'])


# Original data, without rendering it
plotAndTest(dataFrame)

# Ways learned from the tutorial where we can transform a non-stationary into stationary
dataFrame_log = np.log(dataFrame)
# 1st way is to remove the rolling mean
def makeStationarySubstract(dataframe):
    dataFrame_log = np.log(dataframe)
    rolling_mean = dataFrame_log.rolling(4).mean()
    dataFrame_log_minus_mean = dataFrame_log - rolling_mean
    dataFrame_log_minus_mean.dropna(inplace=True)
    # To view the graph and the values of the test, uncomment the code below
    # plotAndTest(dataFrame_log_minus_mean)
    printResults(dataFrame_log_minus_mean)

# 2nd way is to apply exponential decay
rolling_mean_exp_decay = dataFrame_log.ewm(halflife=12, min_periods=0, adjust=True).mean()
dataFrame_log_exp_decay = dataFrame_log - rolling_mean_exp_decay
dataFrame_log_exp_decay.dropna(inplace=True)
# To view the graph and the values of the test, uncomment the code below
# plotAndTest(dataFrame_log_exp_decay)

# 3rd way is to apply time shifting
dataFrame_log_shift = dataFrame_log - dataFrame_log.shift()
dataFrame_log_shift.dropna(inplace=True)
# To view the graph and the values of the test, uncomment the code below
# plotAndTest(dataFrame_log_shift)


# Use of ARIMA model
# Create the ARIMA model
model = ARIMA(dataFrame, order=(0,1,2))
results = model.fit(disp=-1)

# The following part of the code might be used in the future
# to compare the prediction (of the model) to the values given (original time series)
# Predictions for numbers of cars based on ARIMA for the previous data
# predictions_ARIMA_diff = panda.Series(results.fittedvalues, copy=True)
# predictions_ARIMA_diff_cumsum = predictions_ARIMA_diff.cumsum()
# predictions_ARIMA_log = panda.Series(dataFrame_log['numberOfCars'].iloc[0], index=dataFrame_log.index)
# predictions_ARIMA_log = predictions_ARIMA_log.add(predictions_ARIMA_diff_cumsum, fill_value=0)
# predictions_ARIMA = np.exp(predictions_ARIMA_log)
# matplot.plot(dataFrame)
# matplot.plot(predictions_ARIMA)

# The following is used for forecasting the number of cars
# results.plot_predict(1, X), where X is for forecasting for how many number of days
results.plot_predict(1,16)
matplot.show()


