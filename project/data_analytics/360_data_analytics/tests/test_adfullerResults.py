import unittest
import pandas as panda
from analytics_models.arima.adfullerResults import adfullerResults #adfullerADF, adfullerPValue, adfullerCritVal1, adfullerCritVal5, adfullerCritVal10
from statsmodels.tsa.stattools import adfuller

class TestAdfullerResults(unittest.TestCase):
    def initialization(self):
        numberOfCars = [20, 23, 22, 25, 26, 25, 25, 28, 29, 24, 25, 27, 26, 28]
        dataFrame = panda.DataFrame()
        dataFrame['numberOfCars'] = numberOfCars
        return adfuller(dataFrame['numberOfCars'])
        
    def test_adfullerADF(self):
        adfullerResult = self.initialization()
        adfullerResultsObj = adfullerResults()
        value = adfullerResultsObj.adfullerADF(adfullerResult)
        self.assertEqual(round(value, 12), round(-1.9154655060571146, 12))

    def test_adfullerPValue(self):
        adfullerResult = self.initialization()
        adfullerResultsObj = adfullerResults()
        value = adfullerResultsObj.adfullerPValue(adfullerResult)
        self.assertEqual(round(value, 12), round(0.3248209893507471, 12))

    def test_adfullerCritVal1(self):
        adfullerResult = self.initialization()
        adfullerResultsObj = adfullerResults()
        value = adfullerResultsObj.adfullerCritVal1(adfullerResult)
        self.assertEqual(round(value, 12), round(-4.137829282407408, 12))

    def test_adfullerCritVal5e(self):
        adfullerResult = self.initialization()
        adfullerResultsObj = adfullerResults()
        value = adfullerResultsObj.adfullerCritVal5(adfullerResult)
        self.assertEqual(round(value, 12), round(-3.1549724074074077, 12))

    def test_adfullerCritVal10(self):
        adfullerResult = self.initialization()
        adfullerResultsObj = adfullerResults()
        value = adfullerResultsObj.adfullerCritVal10(adfullerResult)
        self.assertEqual(round(value, 12), round(-2.7144769444444443, 12))



        