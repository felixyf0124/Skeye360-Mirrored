import pmdarima as pmd
import numpy as np
import pandas as panda
from matplotlib import pyplot as matplot
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
from forecastArima import forecastArima


class modelPredict:

    def modelAndPredict(self, dataf, direction):
        # Seperate the data as train set and test set
        todayDate = datetime.now()

        # Initialize the start and end of train and test sets
        # To use the following code when we gonna have data flowing into the database every day
        # startTrainDate = (todayDate - timedelta(days=32)).strftime("%Y-%m-%d") + " 00:00:00.000"
        # endTrainDate = (todayDate - timedelta(days=2)).strftime("%Y-%m-%d") + " 23:00:00.000"
        # startTestDate = (todayDate - timedelta(days=1)).strftime("%Y-%m-%d") + " 00:00:00.000"
        # endTrainDate = todayDate.strftime("%Y-%m-%d") + " 23:00:00.000"

        # Hardcoded datetime, to be removed when having the data flowing into the database every day
        startTrainDate = '2020-01-01 00:00:00.000'
        endTrainDate = '2020-01-25 23:00:00.000'
        startTestDate = '2020-01-26 00:00:00.000'
        endTrainDate = '2020-01-26 23:00:00.000'

        # Divide the data into train and test sets
        train = dataf.loc[startTrainDate : endTrainDate]
        test = dataf.loc[startTestDate : endTrainDate]

        forecastArimaObj = forecastArima()
        forecast = forecastArimaObj.forecastWithArima(train, test)

        # The following evaluates the accuracy of the forecast/prediction on the test values that was not trained
        accuracy = r2_score(test.values, forecast)
        print(accuracy)

        # Uncomment the following code to view the residual, which is the difference between the predicted value and the true value
        # arimaModel.plot_diagnostics(figsize=(7,5))

        # Plot the test values on the graph, as well as the forecast/prediction values obtained in the code above
        future_forecast = panda.DataFrame(forecast, index=test.index, columns=['Prediction'])
        panda.concat([test, future_forecast], axis=1).plot()
        matplot.show()

        # Create a list of date for the prediction based on the date got from the test set
        listOfDate = list()
        startDateString = str((todayDate + timedelta(days=1)).strftime("%Y-%m-%d"))
        startDateObj = datetime.strptime(startDateString + " 00:00:00", '%Y-%m-%d %H:%M:%S')
        for index in range(test.shape[0]):
            listOfDate.append((startDateObj + timedelta(hours=index)))
            # print(startDateObj + timedelta(hours=index))

        # To connect to the database
        dbConnect = dbConnection()
        client = dbConnect.connect()
        wtd = writeToDatabase()
        collection = wtd.connection('360backend', 'djangosite_api_count', client)
        intersectionID = 2
        # The following command calls the write method in writeToDatabase.py to write to the mongodb
        wtd.write(direction, forecast, listOfDate, "arima", intersectionID, collection)
        # The following command calls the read method in writeToDatabase.py to read from the mongodb
        # print(wtd.read(collection))
