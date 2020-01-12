import numpy as np
from adfullerResults import printResults

def makeStationarySubstract(dataframe):
    dataFrame_log = np.log(dataframe)
    rolling_mean = dataFrame_log.rolling(4).mean()
    dataFrame_log_minus_mean = dataFrame_log - rolling_mean
    dataFrame_log_minus_mean.dropna(inplace=True)
    printResults(dataFrame_log_minus_mean)

def makeStationaryDecay(dataframe):
    dataFrame_log = np.log(dataframe)
    rolling_mean_exp_decay = dataFrame_log.ewm(halflife=12, min_periods=0, adjust=True).mean()
    dataFrame_log_exp_decay = dataFrame_log - rolling_mean_exp_decay
    dataFrame_log_exp_decay.dropna(inplace=True)
    # To view the graph and the values of the test, uncomment the code below
    printResults(dataFrame_log_exp_decay)

def makeStationaryShift(dataframe):
    dataFrame_log = np.log(dataframe)
    dataFrame_log_shift = dataFrame_log - dataFrame_log.shift()
    dataFrame_log_shift.dropna(inplace=True)
    # To view the graph and the values of the test, uncomment the code below
    printResults(dataFrame_log_shift)


