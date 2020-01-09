# Reference: The steps are based on the following simple auto-ARIMA example found online
# https://pypi.org/project/pmdarima/
# Reference: The parameters are based on the tips given from the alkaline-ml.com website
# http://alkaline-ml.com/pmdarima/develop/tips_and_tricks.html
# Reference: Used r2_score to evaluate the accuracy of the prediction
# https://towardsdatascience.com/get-a-glimpse-of-future-using-time-series-forecasting-using-auto-arima-and-artificial-intelligence-273efabec6aa

import numpy as np
import pandas as panda
import pmdarima as pmd
from adfullerResults import printResults
from transformIntoStationary import makeStationarySubstract, makeStationaryDecay, makeStationaryShift
from matplotlib import pyplot as matplot
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import r2_score
from pmdarima.arima.utils import ndiffs, nsdiffs, ADFTest
from pmdarima.model_selection import train_test_split
from writeToDatabase import write, read
from datetime import datetime, timedelta

#Start of the code (main)

# Read the csv file that was generated from the datasetGenerator.py
# For Windows
# dataframe = panda.read_csv("360_python\models\generatedDataset.csv", index_col = ['date'], parse_dates = ['date'])
dataframe = panda.read_csv("/home/lokevin/Desktop/Soen490/project/data_analytics/360_python/models/generatedDataset.csv", index_col = ['date'], parse_dates = ['date'])

# Uncomment the following code to preview how the data looks like on a graph
# To plot a graph, use only 2 columns
# dataframe = panda.read_csv("360_python\models\generatedDataset.csv", index_col = ['date'], usecols=['8:00-9:00am', 'date'], parse_dates = ['date'])
# lessData is used to display less data on the graph, it is actually set at 5000 and the size of the data is 10000
# lessData = dataframe.head(5000)
# matplot.xlabel('Date')
# matplot.ylabel('Number of cars')
# matplot.plot(lessData)
# matplot.show()
# print(dataframe.head)

# Separate the data by north, south, east and west
northDataRaw = dataframe.loc[dataframe['direction'] == "north"]
southDataRaw = dataframe.loc[dataframe['direction'] == "south"]
eastDataRaw = dataframe.loc[dataframe['direction'] == "east"]
westDataRaw = dataframe.loc[dataframe['direction'] == "west"]

# For comparison purposes, we will only use 1 specific time frame
northData = northDataRaw[['8:00-9:00am']]
southData = southDataRaw[['8:00-9:00am']]
eastData = eastDataRaw[['8:00-9:00am']]
westData = westDataRaw[['8:00-9:00am']]

# Seperate the data as train set and test set
startTestDate = '1999-06-20'
train = westData.loc['1992-08-09':'1999-06-29']
test = westData.loc[startTestDate:'1999-06-27']

# Uncomment out the following code to view values to see if the data is stationary
# printResults(northData['8:00-9:00am'])

# Check if it is stationary
adfTest = ADFTest(alpha=0.05)
pValue, should_diff = adfTest.should_diff(westData) 

# The following prints out values for us to decide about the model
# P-value is used to determine if the data is stationary, value less than 0.05 is stationary
print("P-value:", pValue)
# Should_diff is a boolean to determine if we should add d and D in the parameter
print("Should apply differencing:", should_diff)

# If statement based on the should_diff boolean
# If we should apply differencing than it will enter the if part 
# to get the d and D value to apply in the parameter of the auto_arima function
# The else part will directly use the auto_arima function without apply any differencing
if(should_diff == True):
    # Estimate the parameter d (lower case d or called differencing)
    numDiff = ndiffs(westData, test='adf') 
    print("Estimated d parameter:", numDiff)

    # Estimate the parameter D (capital d or called seasonal differencing)
    numSDiff = nsdiffs(westData,
                        m=10, 
                        max_D=7,
                        test='ch')
    print("Estimated D parameter:", numSDiff)

    # For m parameter: 7 = daily, 52 = weekly, 12 = monthly
    arimaModel = pmd.auto_arima(train, start_p=1, start_q=1,
                            max_p=3, max_q=3, m=7,
                            start_P=0, seasonal=True,
                            d=numDiff, D=numSDiff, trace=True,
                            error_action='ignore',  
                            suppress_warnings=True, 
                            stepwise=True)
else:
    # For m parameter: 7 = daily, 52 = weekly, 12 = monthly
    arimaModel = pmd.auto_arima(train, start_p=1, start_q=1,
                            max_p=3, max_q=3, m=7,
                            start_P=0, seasonal=True,
                            trace=True,
                            error_action='ignore',  
                            suppress_warnings=True, 
                            stepwise=True)

# The following prints out the summary of the model
print(arimaModel.summary())
x = np.arange(test.shape[0])
forecast = arimaModel.predict(n_periods=test.shape[0])
# The following evaluates the accuracy of the forecast/prediction on the test values that was not trained
accuracy = r2_score(test.values, forecast)
print(accuracy)

# Uncomment the following code to view the residual, which is the difference between the predicted value and the true value
# arimaModel.plot_diagnostics(figsize=(7,5))

# Plot the test values on the graph, as well as the forecast/prediction values obtained in the code above
future_forecast = panda.DataFrame(forecast,index = test.index,columns=['Prediction'])
panda.concat([test,future_forecast],axis=1).plot()
matplot.show()

# Create a list of date for the prediction based on the date got from the test set
listOfDate = list()
testStartDateObj = datetime.strptime(startTestDate, '%Y-%m-%d')
for index in range(test.shape[0]):
    listOfDate.append((testStartDateObj + timedelta(days=index)))
    print(testStartDateObj + timedelta(days=index))

# The following command calls the write method in writeToDatabase.py to write to the mongodb
write("EW", forecast, listOfDate, "arima")
# The following command calls the read method in writeToDatabase.py to read from the mongodb
read("Prediction")
