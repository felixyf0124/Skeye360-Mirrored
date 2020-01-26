import pmdarima as pmd
import numpy as np
import pandas as panda
from matplotlib import pyplot as matplot
from adfullerResults import adfullerResults
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import r2_score
from pmdarima.arima.utils import ndiffs, nsdiffs, ADFTest
from pmdarima.model_selection import train_test_split
from writeToDatabase import writeToDatabase
from dbConnection import dbConnection
from datetime import datetime, timedelta, date

class modelPredict:  

    def modelAndPredict(self, dataf, direction):
        # Seperate the data as train set and test set
        startTestDate = '2017-12-31 00:00:00.000'
        train = dataf.loc['2017-12-27 00:00:00.000':'2017-12-30 23:00:00.000']
        test = dataf.loc[startTestDate:'2017-12-31 23:00:00.000']
        # startTestDate = '2017-12-02 00:00:00.000'
        # train = nsDataRaw.loc[(nsDataRaw['date']>'2017-08-27 04:00:00.000') & (nsDataRaw['date']<'2017-12-01 23:00:00.000')]
        # print(train)
        # test = nsDataRaw.loc[(nsDataRaw['date']>startTestDate) & (nsDataRaw['date']<'2017-12-31 23:00:00.000')]

        # Uncomment out the following code to view values to see if the data is stationary
        # adfullerResultsObj = adfullerResults()
        # adfullerResultsObj.printResults(northData['8:00-9:00am'])

        # Check if it is stationary
        adfTest = ADFTest(alpha=0.05)
        pValue, should_diff = adfTest.should_diff(train)

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
            numDiff = ndiffs(train, test='adf')
            print("Estimated d parameter:", numDiff)

            # Estimate the parameter D (capital d or called seasonal differencing)
            numSDiff = nsdiffs(train,
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
        startDateString = str(date.today() + timedelta(days=1))
        startDateObj = datetime.strptime(startDateString + " 00:00:00", '%Y-%m-%d %H:%M:%S')
        for index in range(test.shape[0]):
            listOfDate.append((startDateObj + timedelta(hours=index)))
            print(startDateObj + timedelta(hours=index))

        # To connect to the database
        dbConnect = dbConnection()
        client = dbConnect.connect()
        wtd = writeToDatabase()
        collection = wtd.connection('360backend', 'djangosite_api_count', client)
        intersectionID = 1
        # The following command calls the write method in writeToDatabase.py to write to the mongodb
        wtd.write(direction, forecast, listOfDate, "arima", intersectionID, collection)
        # The following command calls the read method in writeToDatabase.py to read from the mongodb
        print(wtd.read(collection))
