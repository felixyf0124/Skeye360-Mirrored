import csv
import random
import pandas
from datetime import datetime
from datetime import timedelta

def rowPreparator(id, direction, fromD, toD, currentIndex):
    date = datetime.now() + timedelta(days=id)
    row = {'id': id, 'direction': direction, 'from': fromD, 'to': toD, 'date': date,
                '4:00-5:00am': am45[currentIndex], '5:00-6:00am': am56[currentIndex], '6:00-7:00am': am67[currentIndex],
                '7:00-8:00am': am78[currentIndex], '8:00-9:00am': am89[currentIndex]}
    return row

def numberGenerator(minNum, maxNum):
    # For loop to generate number of cars for different times
    listOfRandomNumbers = list()
    for count in range(10000):
        listOfRandomNumbers.append(random.randint(minNum, maxNum))
    return listOfRandomNumbers

am45 = numberGenerator(20, 40)
am56 = numberGenerator(30, 70)
am67 = numberGenerator(50, 100)
am78 = numberGenerator(60, 100)
am89 = numberGenerator(60, 90)

with open('./data_analytics/360_python/models/generatedDataset.csv', mode='w') as csvFile:
    fieldNames = ['id', 'direction', 'from', 'to', 'date', "4:00-5:00am", "5:00-6:00am", "6:00-7:00am", "7:00-8:00am", "8:00-9:00am"]
    csvWriter = csv.DictWriter(csvFile, fieldnames=fieldNames)

    csvWriter.writeheader()
    indexID = 1
    numTimes = int((len(am45))/4)
    for firstIndex in range(numTimes):
        for secondIndex in range(1, 5):
            currentIndex = ((firstIndex * 4) + secondIndex) - 1
            if(secondIndex == 1):
                rowData = rowPreparator(indexID, 'north', 'south', 'north', currentIndex)
            elif(secondIndex == 2):
                rowData = rowPreparator(indexID, 'south', 'north', 'south', currentIndex)
            elif(secondIndex == 3):
                rowData = rowPreparator(indexID, 'east', 'west', 'east', currentIndex)
            elif(secondIndex == 4):
                print("index is ", currentIndex)
                rowData = rowPreparator(indexID, 'west', 'east', 'west', currentIndex)
            csvWriter.writerow(rowData)
            indexID += 1

df = pandas.read_csv('./data_analytics/360_python/models/generatedDataset.csv', index_col='id')
print(df)