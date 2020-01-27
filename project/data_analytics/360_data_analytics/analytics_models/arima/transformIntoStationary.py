import numpy as np
from adfullerResults import adfullerResults

# Ways learned from the tutorial where we can transform a non-stationary into stationary
class transformIntoStationary:
    # 1st way is to remove the rolling mean
    def makeStationarySubstract(self, dataframe):
        dataFrame_log = np.log(dataframe)
        rolling_mean = dataFrame_log.rolling(4).mean()
        dataFrame_log_minus_mean = dataFrame_log - rolling_mean
        dataFrame_log_minus_mean.dropna(inplace=True)
        adfullerResultsObj = adfullerResults()
        adfullerResultsObj.printResults(dataFrame_log_minus_mean)
        return dataFrame_log_minus_mean

    # 2nd way is to apply exponential decay
    def makeStationaryDecay(self, dataframe):
        dataFrame_log = np.log(dataframe)
        rolling_mean_exp_decay = dataFrame_log.ewm(halflife=12, min_periods=0, adjust=True).mean()
        dataFrame_log_exp_decay = dataFrame_log - rolling_mean_exp_decay
        dataFrame_log_exp_decay.dropna(inplace=True)
        # To view the graph and the values of the test, uncomment the code below
        adfullerResultsObj = adfullerResults()
        adfullerResultsObj.printResults(dataFrame_log_exp_decay)
        return dataFrame_log_exp_decay

    # 3rd way is to apply time shifting
    def makeStationaryShift(self, dataframe):
        dataFrame_log = np.log(dataframe)
        dataFrame_log_shift = dataFrame_log - dataFrame_log.shift()
        dataFrame_log_shift.dropna(inplace=True)
        # To view the graph and the values of the test, uncomment the code below
        adfullerResultsObj = adfullerResults()
        adfullerResultsObj.printResults(dataFrame_log_shift)
        return dataFrame_log_shift


