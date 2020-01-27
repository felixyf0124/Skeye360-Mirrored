import csv
import numpy as np
import sys
import pandas as pd
import datetime
from datetime import timedelta
import logging

logger = logging.getLogger('TrafficCarsDataSetGenerator.py')


def generateRandomCarData(numbers):
    df = pd.DataFrame(columns=['ID', 'Date', 'Time', 'From', 'To'])
    array = np.array()
    for x in range(0, numbers):
        car = {
            'ID': x,
            'Date': str(datetime.date.today()),
            'Time': str(datetime.time(5, np.random.randint(39, 51), np.random.randint(0, 60))),
            'From': direction[np.random.randint(0, len(direction))],
            'To': direction[np.random.randint(0, len(direction))]
        }
        # Insert python dictionary to pandas
        print(car)
        df.loc[x] = car
    return df


def generateEdgeCaseCarData(numbers):
    df = pd.DataFrame(columns=['ID', 'Date', 'Time', 'From', 'To'])
    for x in range(0, numbers):
        # random ratio will be 1 to 20
        number = np.random.randint(1, 21)
        if number == 10:
            fromDirection = notBusyDirection[np.random.randint(0, len(notBusyDirection))]
            toDirection = notBusyDirection[np.random.randint(0, len(notBusyDirection))]
        else:
            fromDirection = busyDireciton[np.random.randint(0, len(busyDireciton))]
            toDirection = direction[np.random.randint(0, len(direction))]
        car = {
            'ID': x,
            'Date': str(datetime.date.today()),
            'Time': str(datetime.time(5, np.random.randint(39, 51), np.random.randint(0, 60))),
            'From': fromDirection,
            'To': toDirection
        }
        # Insert python dictionary to pandas
        df.loc[x] = car
        print(car)
    return df


# Step 0: Create sample data
direction = ['north', 'south', 'west', 'east']
busyDireciton = ['west', 'east']
notBusyDirection = ['north', 'south']

# Step 1: Generate a car document
myDict = generateEdgeCaseCarData(200)

# Step 2: Save to CSV file
myDict.to_csv('traffic_edge_case.csv')
