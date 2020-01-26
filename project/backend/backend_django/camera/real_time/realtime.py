import pandas as panda
import json

class Realtime: 
    def __init__(self, counter):
        self.timers = {'north-south': 0, 'east-west': 0, 'left': 0}
        self.counter = counter
        self.start = '0:00:00'
        self.end = '0:00:00'
    
    # Determine which data from csv file to analyze. 
    def det_timeframe(self, counter):
        if (counter == 1):
            self.start = '5:39:55'
            self.end = '5:41:35'
        elif (counter == 2):
            self.start = '5:41:35'
            self.end = '5:43:15'
        elif (counter == 3):
            self.start = '5:43:15'
            self.end = '5:44:55'
        elif (counter == 4):
            self.start = '5:44:55'
            self.end = '5:46:35'
        elif (counter == 5): 
            self.start = '5:46:35'
            self.end = '5:48:15'
        elif (counter == 6):
            self.start = '5:48:15'
            self.end = '5:49:55'
        elif (counter == 7):
            self.start = '5:49:55'
            self.end = '5:51:35'
    
    def det_timers(self):

        #  Extracting traffic data from csv file.
        raw_data = panda.read_csv("~/Soen490/project/backend/backend_django/camera/real_time/traffic_normal_case.csv")

        # Determine which data frame to use.
        self.det_timeframe(self.counter)
                
        # Convert csv file data column to datetime index.
        raw_data['datetime'] = panda.to_datetime(raw_data['datetime'])
        raw_data = raw_data.set_index('datetime')

        # Filter data frame by time.
        raw_data = raw_data.between_time(self.start, self.end)

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

        # Calculating ratio and percentage for all directions.
        nsLeftPercentage = (northSouthLeftCount/northSouthCount)*100
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
        