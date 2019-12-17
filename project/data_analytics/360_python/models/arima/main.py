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

dataframe = panda.read_csv("/Users/kevinlo/Documents/GitHub/Soen490/project/data_analytics/360_python/models/arima/traffic-volume-counts-2014-2018-1.csv", index_col = ['Date', '1:00-2:00PM'], parse_dates = ['Date'])
dataframe.head()
matplot.xlabel('Date')
matplot.ylabel('Number of cars')
matplot.plot(dataframe)

