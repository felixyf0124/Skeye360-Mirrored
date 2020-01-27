from matplotlib import pyplot as matplot
from adfullerResults import adfullerResults

class plotTest:   
    # Method to calculate the rolling mean and standard deviation
    # and then plot it to allow us to visualize
    # and finally to test if it is stationary or not
    def plotAndTest(self, timeseriesData):
        # Calculates the rolling mean and standard deviation
        rolling_mean = timeseriesData.rolling(4).mean()
        rolling_std = timeseriesData.rolling(4).std()

        # Draws the graph with the given data
        matplot.plot(timeseriesData, color = 'blue', label = 'Original')
        matplot.plot(rolling_mean, color = 'red', label = 'Rolling Mean')
        matplot.plot(rolling_std, color = 'black', label = 'Rolling Std')

        # loc means the location of the legend, if best, then it will place 
        # it in the best position to minimize the overlapping
        matplot.legend(loc = 'best')

        matplot.title('Rolling Mean & Rolling Standard Deviation')

        # .show() means to show the graph, else it won't be dislayed to the use
        matplot.show()

        # The code below gives out values, which are used to determine if it stationary or not
        # printResults function is calling another file called adfullerResults.py
        adfullerResultsObj = adfullerResults()
        adfullerResultsObj.printResults(timeseriesData['numberOfCars'])