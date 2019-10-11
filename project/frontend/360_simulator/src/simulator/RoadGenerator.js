export default class RoadGenerator{
    positionOffset={
        x:0,y:0
    };
    laneData = {
        north : {
            numOfLane_from:0,
            numOfLane_to:0,
            numOfLane:0,
            stopLine:{x:0,y:0},
            lane_from:[],
            lane_to:[]
        },
        south : {
            numOfLane_from:0,
            numOfLane_to:0,
            numOfLane:0,
            stopLine:{x:0,y:0},
            lane_from:[],
            lane_to:[]
        },
        east : {
            numOfLane_from:0,
            numOfLane_to:0,
            numOfLane:0,
            stopLine:{x:0,y:0},
            lane_from:[],
            lane_to:[]
        },
        west : {
            numOfLane_from:0,
            numOfLane_to:0,
            numOfLane:0,
            stopLine:{x:0,y:0},
            lane_from:[],
            lane_to:[]
        }
    }
    laneData_Graphic = [];
    constructor(positionOffset_obj, numOfLanes_north, numOfLanes_south, numOfLanes_east, numOfLanes_west, laneWidth){
        this.positionOffset = positionOffset_obj;
        this.laneData.north.numOfLane_from = numOfLanes_north[0];
        this.laneData.north.numOfLane_to = numOfLanes_north[1]; 
        this.laneData.north.numOfLane = numOfLanes_north[0] + numOfLanes_north[1]; 

        this.laneData.south.numOfLane_from = numOfLanes_south[0];
        this.laneData.south.numOfLane_to = numOfLanes_south[1];
        this.laneData.south.numOfLane = numOfLanes_south[0] + numOfLanes_south[1]; 

        this.laneData.east.numOfLane_from = numOfLanes_east[0];
        this.laneData.east.numOfLane_to = numOfLanes_east[1];
        this.laneData.east.numOfLane = numOfLanes_east[0] + numOfLanes_east[1]; 

        this.laneData.west.numOfLane_from = numOfLanes_west[0];
        this.laneData.west.numOfLane_to = numOfLanes_west[1];
        this.laneData.west.numOfLane = numOfLanes_west[0] + numOfLanes_west[1]; 

        this.laneWidth = laneWidth;
    }


    cookCoordinateData(){
        
        //north
        if(this.laneData.east.numOfLane_from>=this.laneData.west.numOfLane_to)
        {
            this.laneData.north.stopLine.y = -this.laneData.east.numOfLane_from*this.laneWidth*1.1;
            const _size = this.laneData.east.numOfLane_from;
            for(i=0;i<_size; ++i)
            {
                const _laneInfo = {
                    index: i,
                    coordinate:{
                        x: this.laneWidth * (i+0.5),
                        y: -this.laneWidth * this.laneData.west.numOfLane_to
                    }
                }
                this.laneData.north.lane_from
            }
        }else
        {
            this.laneData.north.stopLine.y = -this.laneData.west.numOfLane_to*this.laneWidth*1.1;
        }
        //south
        if(this.laneData.east.numOfLane_to>=this.laneData.west.numOfLane_from)
        {
            this.laneData.south.stopLine.y = this.laneData.east.numOfLane_to*this.laneWidth*1.1;
        }else
        {
            this.laneData.south.stopLine.y = this.laneData.west.numOfLane_from*this.laneWidth*1.1;
        }
        //east
        if(this.laneData.north.numOfLane_to>=this.laneData.south.numOfLane_from)
        {
            this.laneData.east.stopLine.y = this.laneData.north.numOfLane_to*this.laneWidth*1.1;
        }else
        {
            this.laneData.east.stopLine.y = this.laneData.south.numOfLane_from*this.laneWidth*1.1;
        }
        //west
        if(this.laneData.north.numOfLane_from>=this.laneData.south.numOfLane_to)
        {
            this.laneData.west.stopLine.y = -this.laneData.north.numOfLane_from*this.laneWidth*1.1;
        }else
        {
            this.laneData.west.stopLine.y = -this.laneData.south.numOfLane_to*this.laneWidth*1.1;
        }
    }


    cookGraphicRenderData(){
        _data = {
            
        }
    }

}