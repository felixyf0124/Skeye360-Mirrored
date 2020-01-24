import pandas as panda
import json

class Realtime: 
    def __init__(self):
        self.timers = {}

    def det_timers(self):
        #  Extracting traffic data from csv file
        raw_data = panda.read_csv("~/Soen490/project/backend/backend_django/camera/real_time/traffic_normal_case.csv")

        # Separating traffic data by directions
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

        # Counting cars for each directions
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



        # Counting cars going straight and turning right
        northSouthCount = ssCount + snCount + nnCount + nsCount + seCount + nwCount
        eastWestCount = eeCount + ewCount + wwCount + weCount + enCount + wsCount

        straightRatio = (northSouthCount/eastWestCount)

        # Counting cars turning left
        northSouthLeftCount = swCount + neCount
        northSouthLeftPercentage = (northSouthLeftCount/northSouthCount)*100

        eastWestLeftCount = wnCount + esCount
        eastWestLeftPercentage = (eastWestLeftCount/eastWestCount)*100

        # Setting timers
        leftTurnTimer = 10
        northSouthTimer = 25
        eastWestTimer = 25

        # left turn
        if (northSouthLeftPercentage > 40 or eastWestLeftPercentage > 40):
            leftTurnTimer = 15
        elif (30 > northSouthLeftPercentage < 20 or 30 > eastWestLeftPercentage < 20):
            leftTurnTimer = 12.5
        else: 
            leftTurnTimer = 8
        
        # straight and right turn
        if (1 < straightRatio < 1.5):
            northSouthTimer = 30
            eastWestTimer = 25
        elif (1.5 < straightRatio < 2):
            northSouthTimer = 35
            eastWestTimer = 25
        elif (0.5 < straightRatio < 1):
            northSouthTimer = 25
            eastWestTimer = 30
        elif (0.25 < straightRatio < 0.5):
            northSouthTimer = 25
            eastWestTimer = 35
        else: 
            northSouthTimer = 20
            eastWestTimer = 30 

        self.timers['NorthSouth timers'] = northSouthTimer
        self.timers['EastWest timers'] = eastWestTimer
        self.timers['EastWest timers'] = leftTurnTimer
