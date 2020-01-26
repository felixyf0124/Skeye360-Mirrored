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
        startTestDate = '2019-12-31 00:00:00.000'
        train = dataf.loc['2019-12-27 00:00:00.000':'2019-12-30 23:00:00.000']
        test = dataf.loc[startTestDate:'2019-12-31 23:00:00.000']
        # startTestDate = '2017-12-02 00:00:00.000'
        # train = nsDataRaw.loc[(nsDataRaw['date']>'2017-08-27 04:00:00.000') & (nsDataRaw['date']<'2017-12-01 23:00:00.000')]
        # print(train)
        # test = nsDataRaw.loc[(nsDataRaw['date']>startTestDate) & (nsDataRaw['date']<'2017-12-31 23:00:00.000')]
        forecastArimaObj = forecastArima()
        forecast = forecastArimaObj.forecastWithArima(train, test)

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
            # print(startDateObj + timedelta(hours=index))

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
