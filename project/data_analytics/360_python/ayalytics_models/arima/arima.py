#Referemce: Based on arima from Towardsdatascience to build the model:
# https://towardsdatascience.com/machine-learning-part-19-time-series-and-autoregressive-integrated-moving-average-model-arima-c1005347b0d7

import numpy as np
import pandas as panda
from matplotlib import pyplot as matplot
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima_model import ARIMA
from plotTest import plotTest

class arima:
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

    # Original data, without rendering it
    plotTestObj = plotTest()
    plotTestObj.plotAndTest(dataFrame)

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


