import pmdarima as pmd
from pmdarima.arima.utils import ndiffs, nsdiffs, ADFTest

class forecastArima:

    def adfTestResults(self, train):
        adfTest = ADFTest(alpha=0.05)
        return adfTest.should_diff(train)

    def differencingValue(self, train):
        return ndiffs(train, test='adf')

    def seasonalDifferencingValue(self, train):
        return nsdiffs(train, m=10, max_D=7, test='ch')

    def forecastWithArima(self, train, test):

        # Check if it is stationary
        pValue, should_diff = self.adfTestResults(train)

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
            # numDiff = ndiffs(train, test='adf')
            numDiff = self.differencingValue(train)
            print("Estimated d parameter:", numDiff)

            # Estimate the parameter D (capital d or called seasonal differencing)
            # numSDiff = nsdiffs(train,
            #                     m=10,
            #                     max_D=7,
            #                     test='ch')
            numSDiff = self.seasonalDifferencingValue(train)
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
        forecast = arimaModel.predict(n_periods=test.shape[0])  
        return forecast