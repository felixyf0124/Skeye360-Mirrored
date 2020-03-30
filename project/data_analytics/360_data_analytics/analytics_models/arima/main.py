# Reference: The steps are based on the following simple auto-ARIMA example found online
# https://pypi.org/project/pmdarima/
# Reference: The parameters are based on the tips given from the alkaline-ml.com website
# http://alkaline-ml.com/pmdarima/develop/tips_and_tricks.html
# Reference: Used r2_score to evaluate the accuracy of the prediction
# https://towardsdatascience.com/get-a-glimpse-of-future-using-time-series-forecasting-using-auto-arima-and-artificial-intelligence-273efabec6aa

import numpy as np
import pandas as panda
from modelPredict import modelPredict

class main:

    def mainArima(self):
        #Start of the code (main)

        # Read the csv file that was generated from the DatasetGenerator.py
        # For Windows
        # dataframe = panda.read_csv("~\Documents\Github\soen490_dev_env\project\data_analytics\\360_data_analytics\data_generator\csv\\test.csv", index_col = ['date'], parse_dates = ['date'], encoding = 'utf-16', delimiter=";")
        # For Linux, the path depends on where the Github project is cloned
        dataframe = panda.read_csv("~/Soen490/project/data_analytics/360_data_analytics/data_generator/csv/test.csv", index_col = ['date'], parse_dates = ['date'], delimiter=";")

        # Uncomment the following code to preview how the data looks like on a graph
        # To plot a graph, use only 2 columns
        # dataframe = panda.read_csv("360_data_analytics\models\generatedDataset.csv", index_col = ['date'], usecols=['8:00-9:00am', 'date'], parse_dates = ['date'])
        # lessData is used to display less data on the graph, it is actually set at 5000 and the size of the data is 10000
        # lessData = dataframe.head(5000)
        # matplot.xlabel('Date')
        # matplot.ylabel('Number of cars')
        # matplot.plot(lessData)
        # matplot.show()
        # print(dataframe.head)

        allDirectionsNames = dataframe['series']
        directionNames = list(dict.fromkeys(allDirectionsNames))
        directionNames.sort()

        modelPredictObj = modelPredict()
        
        directionNamesLess = ["ns", "sn", "ew", "we", "en", "es"]
        for direction in directionNamesLess:
            dataf = dataframe.loc[dataframe['series'] == direction][['value']].round(0).astype(int)
            modelPredictObj.modelAndPredict(dataf, direction)

 