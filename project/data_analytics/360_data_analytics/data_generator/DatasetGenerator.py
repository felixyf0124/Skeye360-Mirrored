import csv
import random
import pandas
from datetime import datetime
from datetime import timedelta


# Function to prepare the row to be inserted
def rowPreparator(id, direction, fromD, toD, am45Data, am56Data, am67Data, am78Data, am89Data):
    startedYear = (datetime.now().date() - timedelta(days=10000)).year
    # We add 'n' number of days depending on the id to simulate the dates
    date = datetime.now().date() - timedelta(days=10000) + timedelta(days=id)
    data45 = numCar(startedYear, date, am45Data)
    data56 = numCar(startedYear, date, am56Data)
    data67 = numCar(startedYear, date, am67Data)
    data78 = numCar(startedYear, date, am78Data)
    data89 = numCar(startedYear, date, am89Data)
    row = {'id': id, 'direction': direction, 'from': fromD, 'to': toD, 'date': date,
           '4:00-5:00pm': data45, '5:00-6:00pm': data56, '6:00-7:00pm': data67,
           '7:00-8:00pm': data78, '8:00-9:00pm': data89}
    return row


def numCar(startedYear, date, numCar):
    month = date.month
    year = date.year
    yearElapsed = year - startedYear
    return numCarAdderByMonth(yearElapsed, month, numCar)


def numCarAdderByMonth(yearElapsed, month, numCar):
    randomAdder = (yearElapsed * random.randint(1, 3))
    monthSwitch = {
        1: (numCar * 0.6),
        2: (numCar * 0.8),
        3: numCar,
        4: numCar,
        5: (numCar * 0.8),
        6: (numCar * 0.7),
        7: (numCar * 0.5),
        8: (numCar * 0.6),
        9: (numCar * 0.8),
        10: numCar,
        11: (numCar * 0.9),
        12: (numCar * 0.5)
    }
    # if(yearElapsed == 0 and month == 12):
    #     print("monthSwitch: ", int(monthSwitch.get(month)), " | randomAdder: ", randomAdder, " | equal: ", int(monthSwitch.get(month)) + randomAdder)
    return (int(monthSwitch.get(month)) + randomAdder)


# Function to generate random number for 'n' times, with 2 parameters to set the boundary (or range) and returns the results as a list
def numberGenerator(minNum, maxNum):
    # Instantiation of listOfRandomNumbers to a list
    listOfRandomNumbers = list()
    # For the code below until the end, we have specified 'n' number of times, and our 'n' is currently set to 10000
    n = 10000
    for count in range(n):
        listOfRandomNumbers.append(random.randint(minNum, maxNum))
    return listOfRandomNumbers


# Main part of the code

# am45 correspond to 4:00am to 5:00am and we generate 'n' number of times of data for each hours, where 'n' is set in the numberGenerator function
am45 = numberGenerator(20, 40)
am56 = numberGenerator(50, 70)
am67 = numberGenerator(80, 100)
am78 = numberGenerator(90, 110)
am89 = numberGenerator(60, 90)

# For Mac OS, uncomment the "with open" command below and comment out the second "with open"
# with open('./360_data_analytics/360_data_analytics/ayalytics_models/generatedDataset.csv', mode='w') as csvFile:
# The following code creates the generatedDataset.csv file and writes into it
with open('360_data_analytics\models\generatedDataset.csv', mode='w') as csvFile:
    fieldNames = ['id', 'direction', 'from', 'to', 'date', "4:00-5:00pm", "5:00-6:00pm", "6:00-7:00pm", "7:00-8:00pm",
                  "8:00-9:00pm"]
    csvWriter = csv.DictWriter(csvFile, fieldnames=fieldNames)
    csvWriter.writeheader()
    indexID = 1
    numTimes = int((len(am45)) / 4)
    # There are 2 for loops, the first for loop does it 'n' divided by 4 times, where n is the range set in the numberGenerator function
    # The reason is that with 2 for loops, it is easier to fake the data, because the second index is from 1 to 4 and each 'second index'
    # correponds to a direction
    for firstIndex in range(numTimes):
        for secondIndex in range(1, 13):
            currentIndex = indexID - 1
            if (secondIndex == 1):
                rowData = rowPreparator(indexID, 'north', 'south', 'NS', am45[currentIndex], am56[currentIndex],
                                        am67[currentIndex], am78[currentIndex], am89[currentIndex])
            elif (secondIndex == 2):
                rowData = rowPreparator(indexID, 'north', 'east', 'NE', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 3):
                rowData = rowPreparator(indexID, 'north', 'west', 'NW', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 4):
                rowData = rowPreparator(indexID, 'south', 'north', 'SN', am45[currentIndex], am56[currentIndex],
                                        am67[currentIndex], am78[currentIndex], am89[currentIndex])
            elif (secondIndex == 5):
                rowData = rowPreparator(indexID, 'south', 'east', 'SE', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 6):
                rowData = rowPreparator(indexID, 'south', 'west', 'SW', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 7):
                rowData = rowPreparator(indexID, 'east', 'west', 'EW', am45[currentIndex], am56[currentIndex],
                                        am67[currentIndex], am78[currentIndex], am89[currentIndex])
            elif (secondIndex == 8):
                rowData = rowPreparator(indexID, 'east', 'north', 'EN', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 9):
                rowData = rowPreparator(indexID, 'east', 'south', 'ES', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 10):
                rowData = rowPreparator(indexID, 'west', 'east', 'WE', am45[currentIndex], am56[currentIndex],
                                        am67[currentIndex], am78[currentIndex], am89[currentIndex])
            elif (secondIndex == 11):
                rowData = rowPreparator(indexID, 'west', 'north', 'WN', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
            elif (secondIndex == 12):
                rowData = rowPreparator(indexID, 'west', 'south', 'WS', int(round(am45[currentIndex] / 2)),
                                        int(round(am56[currentIndex] / 2)), int(round(am67[currentIndex] / 2)),
                                        int(round(am78[currentIndex] / 2)), int(round(am89[currentIndex] / 2)))
                indexID += 1
            csvWriter.writerow(rowData)

# For Mac OS, uncomment the "read_csv" command below and comment out the second "read_csv"
# df = pandas.read_csv('./360_data_analytics/360_data_analytics/ayalytics_models/generatedDataset.csv', index_col='id')
# The following code reads the data that was just generated and prints it
df = pandas.read_csv('360_data_analytics\models\generatedDataset.csv', index_col='id')
print(df)
