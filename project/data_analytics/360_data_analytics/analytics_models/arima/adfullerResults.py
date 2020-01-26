from statsmodels.tsa.stattools import adfuller

class adfullerResults:
    # Prints out all of the important values to decide if the data is stationary or not
    def printResults(self, dataFrameData):
        adfullerResults = adfuller(dataFrameData)
        print('ADF Statistic: {}'.format(self.adfullerADF(adfullerResults)))
        print('p-value: {}'.format(self.adfullerPValue(adfullerResults)))
        print('Critical Values:')
        print('\t1%:', self.adfullerCritVal1(adfullerResults))
        print('\t5%:', self.adfullerCritVal5(adfullerResults))
        print('\t10%:', self.adfullerCritVal10(adfullerResults))

    # The following functions are methods so we could retrieve each individual value
    def adfullerADF(self, adfullerResults):
        return adfullerResults[0]

    def adfullerPValue(self, adfullerResults):
        return adfullerResults[1]

    def adfullerCritVal1(self, adfullerResults):
        return adfullerResults[4].get('1%')

    def adfullerCritVal5(self, adfullerResults):
        return adfullerResults[4].get('5%')

    def adfullerCritVal10(self, adfullerResults):
        return adfullerResults[4].get('10%')