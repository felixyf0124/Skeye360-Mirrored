import unittest
import pandas as panda
from models.adfullerResults import adfullerADF, adfullerPValue, adfullerCritVal1, adfullerCritVal5, adfullerCritVal10
from statsmodels.tsa.stattools import adfuller

class TestAdfullerResults(unittest.TestCase):
    def initialization(self):
        numberOfCars = [20, 23, 22, 25, 26, 25, 25, 28, 29, 24, 25, 27, 26, 28]
        dataFrame = panda.DataFrame()
        dataFrame['numberOfCars'] = numberOfCars
        return adfuller(dataFrame['numberOfCars'])
        
    def test_adfullerADF(self):
        adfullerResults = self.initialization()
        value = adfullerADF(adfullerResults)
        self.assertEqual(value, -1.9154655060571146)

    def test_adfullerPValue(self):
        adfullerResults = self.initialization()
        value = adfullerPValue(adfullerResults)
        self.assertEqual(value, 0.3248209893507471)

    def test_adfullerCritVal1(self):
        adfullerResults = self.initialization()
        value = adfullerCritVal1(adfullerResults)
        self.assertEqual(value, -4.137829282407408)

    def test_adfullerCritVal5e(self):
        adfullerResults = self.initialization()
        value = adfullerCritVal5(adfullerResults)
        self.assertEqual(value, -3.1549724074074077)

    def test_adfullerCritVal10(self):
        adfullerResults = self.initialization()
        value = adfullerCritVal10(adfullerResults)
        self.assertEqual(value, -2.7144769444444443)



        