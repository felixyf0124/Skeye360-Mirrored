import unittest
import pandas as panda
from analytics_models.arima.forecastArima import forecastArima


class test_forecastArima(unittest.TestCase):

    # Create my own dataset with the limitation of only 2 columns
    date = ['2017-12-31 00:00:00', '2017-12-31 01:00:00', '2017-12-31 02:00:00', '2017-12-31 03:00:00', '2017-12-31 04:00:00', '2017-12-31 05:00:00', '2017-12-31 06:00:00',
            '2017-12-31 07:00:00', '2017-12-31 08:00:00', '2017-12-31 09:00:00', '2017-12-31 10:00:00', '2017-12-31 11:00:00', '2017-12-31 12:00:00', '2017-12-31 13:00:00',
            '2017-12-31 14:00:00', '2017-12-31 15:00:00', '2017-12-31 16:00:00', '2017-12-31 17:00:00', '2017-12-31 18:00:00', '2017-12-31 19:00:00', '2017-12-31 20:00:00']
    value = [20, 23, 22, 25, 26, 25, 25, 30, 52, 48, 55, 41, 32, 36, 56, 32, 48, 56, 59, 46, 31]

    # Set up the dataframe and choose the date column as index
    dataFrame = panda.DataFrame()
    dataFrame['date'] = date
    dataFrame['value'] = value
    dataFrame.set_index('date', inplace=True)
    
    # Separate the dataset into train and test
    train = dataFrame.loc['2017-12-31 00:00:00':'2017-12-31 17:00:00']
    test = dataFrame.loc['2017-12-31 19:00:00':'2017-12-31 20:00:00']

    # Create forecastArima class object and execute forecastWithArima function
    forecastArimaObj = forecastArima()


    def test_forecastWithArima(self):
        forecast = self.forecastArimaObj.forecastWithArima(self.train, self.test)

        # Expected result when rounded to an integer, using float numbers (with decimals) can lead to failure
        # because some computers (or OS) print out slightly different results 
        expected = [57, 60]
        forecastRounded = list(forecast.round(0).astype(int))
        
        # Compare to see if the forecast and expected results are equal (when rounded to an integer)
        self.assertListEqual(forecastRounded, expected)

    def test_adfTestResults(self):
        rPValue, rShouldDiff = self.forecastArimaObj.adfTestResults(self.train)

        # Expected result when rounded to an integer, using float numbers (with decimals) can lead to failure
        # because some computers (or OS) print out slightly different results 
        pValueRounded = rPValue.round(2)
        expectedPValue = 0.54
        expectedDiff = True

        self.assertEqual(pValueRounded, expectedPValue)
        self.assertEqual(rShouldDiff, expectedDiff)

    def test_differencingValue(self):
        differencingValue = self.forecastArimaObj.differencingValue(self.train)
        expectedDiffVal = 2

        self.assertEqual(differencingValue, expectedDiffVal)

    def test_seasonalDifferencingValue(self):
        differencingValue = self.forecastArimaObj.seasonalDifferencingValue(self.train)
        expectedSeaDiffVal = 0

        self.assertEqual(differencingValue, expectedSeaDiffVal)