from statsmodels.tsa.stattools import adfuller

# Prints out all of the important values to decide if the data is stationary or not
def printResults(dataFrameData):
    adfullerResults = adfuller(dataFrameData)
    print('ADF Statistic: {}'.format(adfullerADF(adfullerResults)))
    print('p-value: {}'.format(adfullerPValue(adfullerResults)))
    print('Critical Values:')
    print('\t1%:', adfullerCritVal1(adfullerResults))
    print('\t5%:', adfullerCritVal5(adfullerResults))
    print('\t10%:', adfullerCritVal10(adfullerResults))

# The following functions are methods so we could retrieve each individual value
def adfullerADF(adfullerResults):
    return adfullerResults[0]

def adfullerPValue(adfullerResults):
    return adfullerResults[1]

def adfullerCritVal1(adfullerResults):
    return adfullerResults[4].get('1%')

def adfullerCritVal5(adfullerResults):
    return adfullerResults[4].get('5%')

def adfullerCritVal10(adfullerResults):
    return adfullerResults[4].get('10%')