import pandas as panda
import json
import numpy as np
from datetime import datetime

class Realtime: 
    def __init__(self):
        self.timers = {'north-south': 0, 'east-west': 0, 'left': 0}
        self.start = 0
        self.end = 0
    
    def get_milli_time(self):
        time = datetime.now()
        return (((((time.hour * 60) + time.minute) * 60) + time.second) * 1000)

    def add_loop_time(self, data):
        for i in range(data.shape[0]):
            if (i == 0):
                data.loc[i, 'loop_time'] = 0
            else: 
                data.loc[i, 'loop_time'] = data.iloc[i]['milli_time'] - data.iloc[0]['milli_time']
        return data
    
    def det_timers(self):

        #  Extracting traffic data from csv file.
        raw_data = panda.read_csv("./real_time/traffic_normal_case.csv")
        
        # Convert csv file data column to datetime index.
        raw_data['datetime'] = panda.to_datetime(raw_data['datetime'])
        
        # Sorting time (ascending) and resetting index.
        raw_data = raw_data.sort_values(['datetime'])
        raw_data = raw_data.reset_index(drop=True)

        # Adding new column with time im milliseconds.
        raw_data['milli_time'] = (((((raw_data['datetime'].dt.hour * 60) + raw_data['datetime'].dt.minute) * 60) + raw_data['datetime'].dt.second) * 1000)

        # Get current time.
        t_sys = int(self.get_milli_time())

        # Get data period.
        period = int(raw_data.tail(1)['milli_time']) - int(raw_data.head(1)['milli_time'])

        # Set matching time (timeline for the loop).
        currentTime = np.mod(t_sys, period)
        
        # Add loop_time to match current time each call.
        raw_data = self.add_loop_time(raw_data)

        # Set start and end range time to run algorithm.
        self.start = np.mod((np.mod(t_sys, period) - (20*1000) + period), period)
        self.end = currentTime

        # Data selection based on time. 
        raw_data = raw_data.loc[(raw_data['loop_time'] >= self.start) & (raw_data['loop_time'] <= self.end)]

        # Separating traffic data by directions.
        southToSouth = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "south")]
        southToNorth = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "north")]
        southToEast = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "east")]
        southToWest = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "west")]

        northToNorth = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "north")]
        northToSouth = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "south")]
        northToEast = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "east")]
        northToWest = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "west")]

        eastToEast = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "east")]
        eastToSouth = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "south")]
        eastToNorth = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "north")]
        eastToWest = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "west")]

        westToWest = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "west")]
        westToSouth = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "south")]
        westToNorth = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "north")]
        westToEast = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "east")]

        # Counting cars for each directions.
        ssCount = southToSouth.shape[0]
        snCount = southToNorth.shape[0]
        seCount = southToEast.shape[0]
        swCount = southToWest.shape[0]

        nnCount = northToNorth.shape[0]
        nsCount = northToSouth.shape[0]
        neCount = northToEast.shape[0]
        nwCount = northToWest.shape[0]

        eeCount = eastToEast.shape[0]
        esCount = eastToSouth.shape[0]
        enCount = eastToNorth.shape[0]
        ewCount = eastToWest.shape[0]

        wwCount = westToWest.shape[0]
        wsCount = westToSouth.shape[0]
        wnCount = westToNorth.shape[0]
        weCount = westToEast.shape[0]

        # Counting cars going straight and turning right.
        northSouthCount = ssCount + snCount + nnCount + nsCount + seCount + nwCount
        eastWestCount = eeCount + ewCount + wwCount + weCount + enCount + wsCount

        # Counting cars turning left.
        northSouthLeftCount = swCount + neCount
        eastWestLeftCount = wnCount + esCount

        # Calculating ratios for all directions
        if (northSouthCount == 0):
            nsLeftPercentage = 0
        else: 
            nsLeftPercentage = (northSouthLeftCount/northSouthCount)*100
        
        if (eastWestCount == 0):
            ewLeftPercentage = 0
            straightRatio = 10

        else: 
            ewLeftPercentage = (eastWestLeftCount/eastWestCount)*100
            straightRatio = (northSouthCount/eastWestCount)

        # Setting timers: sum(timers) = 80s
        timerSum = 80

        # left turn
        if (nsLeftPercentage > 40 or ewLeftPercentage > 40):
            leftTurnTimer = 25
        elif (40 > nsLeftPercentage > 25 or 40 > ewLeftPercentage > 25):
            leftTurnTimer = 20
        else: 
            leftTurnTimer = 15
        
        timerSum = timerSum - leftTurnTimer

        # straight and right turn
        # more cars coming from north and south
        if (1 < straightRatio < 1.5):
            northSouthTimer = ((60/100)*timerSum)
            eastWestTimer = ((40/100)*timerSum)
        elif (1.5 < straightRatio < 2):
            northSouthTimer = ((65/100)*timerSum)
            eastWestTimer = ((35/100)*timerSum)
        elif (straightRatio > 2): 
            northSouthTimer = ((70/100)*timerSum)
            eastWestTimer = ((30/100)*timerSum)
        # more cars coming from east and west
        elif (0.5 < straightRatio < 1):
            northSouthTimer = ((40/100)*timerSum)
            eastWestTimer = ((60/100)*timerSum)
        elif (0.25 < straightRatio < 0.5):
            northSouthTimer = ((35/100)*timerSum)
            eastWestTimer = ((65/100)*timerSum)
        elif (straightRatio < 0.25): 
            northSouthTimer = ((30/100)*timerSum)
            eastWestTimer = ((70/100)*timerSum)
        # equal number of cars from both sides
        else: 
            northSouthTimer = ((50/100)*timerSum)
            eastWestTimer = ((50/100)*timerSum)

        self.timers['north-south'] = northSouthTimer
        self.timers['east-west'] = eastWestTimer
        self.timers['left'] = leftTurnTimer
        
    # For testing purposed
    def det_timers_test(self, data):

        #  Extracting traffic data from csv file.
        raw_data = data
        
        # Convert csv file data column to datetime index.
        raw_data['datetime'] = panda.to_datetime(raw_data['datetime'])
        
        # Sorting time (ascending) and resetting index.
        raw_data = raw_data.sort_values(['datetime'])
        raw_data = raw_data.reset_index(drop=True)

        # Adding new column with time im milliseconds.
        raw_data['milli_time'] = (((((raw_data['datetime'].dt.hour * 60) + raw_data['datetime'].dt.minute) * 60) + raw_data['datetime'].dt.second) * 1000)

        # Get current time.
        t_sys = int(self.get_milli_time())

        # Get data period.
        period = int(raw_data.tail(1)['milli_time']) - int(raw_data.head(1)['milli_time'])

        # Set matching time (timeline for the loop).
        currentTime = np.mod(t_sys, period)
        
        # Add loop_time to match current time each call.
        raw_data = self.add_loop_time(raw_data)

        # Set start and end range time to run algorithm.
        self.start = np.mod((np.mod(t_sys, period) - (20*1000) + period), period)
        self.end = currentTime

        # Data selection based on time. 
        raw_data = raw_data.loc[(raw_data['loop_time'] >= self.start) & (raw_data['loop_time'] <= self.end)]

        # Separating traffic data by directions.
        southToSouth = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "south")]
        southToNorth = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "north")]
        southToEast = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "east")]
        southToWest = raw_data.loc[(raw_data['from'] == "south") & (raw_data['to'] == "west")]

        northToNorth = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "north")]
        northToSouth = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "south")]
        northToEast = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "east")]
        northToWest = raw_data.loc[(raw_data['from'] == "north") & (raw_data['to'] == "west")]

        eastToEast = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "east")]
        eastToSouth = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "south")]
        eastToNorth = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "north")]
        eastToWest = raw_data.loc[(raw_data['from'] == "east") & (raw_data['to'] == "west")]

        westToWest = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "west")]
        westToSouth = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "south")]
        westToNorth = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "north")]
        westToEast = raw_data.loc[(raw_data['from'] == "west") & (raw_data['to'] == "east")]

        # Counting cars for each directions.
        ssCount = southToSouth.shape[0]
        snCount = southToNorth.shape[0]
        seCount = southToEast.shape[0]
        swCount = southToWest.shape[0]

        nnCount = northToNorth.shape[0]
        nsCount = northToSouth.shape[0]
        neCount = northToEast.shape[0]
        nwCount = northToWest.shape[0]

        eeCount = eastToEast.shape[0]
        esCount = eastToSouth.shape[0]
        enCount = eastToNorth.shape[0]
        ewCount = eastToWest.shape[0]

        wwCount = westToWest.shape[0]
        wsCount = westToSouth.shape[0]
        wnCount = westToNorth.shape[0]
        weCount = westToEast.shape[0]

        # Counting cars going straight and turning right.
        northSouthCount = ssCount + snCount + nnCount + nsCount + seCount + nwCount
        eastWestCount = eeCount + ewCount + wwCount + weCount + enCount + wsCount

        # Counting cars turning left.
        northSouthLeftCount = swCount + neCount
        eastWestLeftCount = wnCount + esCount

        # Calculating ratios for all directions
        if (northSouthCount == 0):
            nsLeftPercentage = 0
        else: 
            nsLeftPercentage = (northSouthLeftCount/northSouthCount)*100
        
        if (eastWestCount == 0):
            ewLeftPercentage = 0
            straightRatio = 10

        else: 
            ewLeftPercentage = (eastWestLeftCount/eastWestCount)*100
            straightRatio = (northSouthCount/eastWestCount)

        # Setting timers: sum(timers) = 80s
        timerSum = 80

        # left turn
        if (nsLeftPercentage > 40 or ewLeftPercentage > 40):
            leftTurnTimer = 25
        elif (40 > nsLeftPercentage > 25 or 40 > ewLeftPercentage > 25):
            leftTurnTimer = 20
        else: 
            leftTurnTimer = 15
        
        timerSum = timerSum - leftTurnTimer

        # straight and right turn
        # more cars coming from north and south
        if (1 < straightRatio < 1.5):
            northSouthTimer = ((60/100)*timerSum)
            eastWestTimer = ((40/100)*timerSum)
        elif (1.5 < straightRatio < 2):
            northSouthTimer = ((65/100)*timerSum)
            eastWestTimer = ((35/100)*timerSum)
        elif (straightRatio > 2): 
            northSouthTimer = ((70/100)*timerSum)
            eastWestTimer = ((30/100)*timerSum)
        # more cars coming from east and west
        elif (0.5 < straightRatio < 1):
            northSouthTimer = ((40/100)*timerSum)
            eastWestTimer = ((60/100)*timerSum)
        elif (0.25 < straightRatio < 0.5):
            northSouthTimer = ((35/100)*timerSum)
            eastWestTimer = ((65/100)*timerSum)
        elif (straightRatio < 0.25): 
            northSouthTimer = ((30/100)*timerSum)
            eastWestTimer = ((70/100)*timerSum)
        # equal number of cars from both sides
        else: 
            northSouthTimer = ((50/100)*timerSum)
            eastWestTimer = ((50/100)*timerSum)

        self.timers['north-south'] = northSouthTimer
        self.timers['east-west'] = eastWestTimer
        self.timers['left'] = leftTurnTimer
        
