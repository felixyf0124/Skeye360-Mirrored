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

        this.cookCoordinateData();
    }


    cookCoordinateData(){
        var i;
        //north
        for(i=0;i<this.laneData.north.numOfLane_from; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: -this.laneWidth * this.laneData.west.numOfLane_to
                }
            }
            this.laneData.north.lane_from.push(_laneInfo);
        }
        for(i=0;i<this.laneData.north.numOfLane_to; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: -this.laneWidth * this.laneData.east.numOfLane_from
                }
            }
            this.laneData.north.lane_to.push(_laneInfo);
        }
        if(this.laneData.east.numOfLane_from>=this.laneData.west.numOfLane_to)
        {
            this.laneData.north.stopLine.y = -this.laneData.east.numOfLane_from*this.laneWidth*1.1;
            
        }else
        {
            this.laneData.north.stopLine.y = -this.laneData.west.numOfLane_to*this.laneWidth*1.1;
        }

        //south
        for(i=0;i<this.laneData.south.numOfLane_from; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: this.laneWidth * this.laneData.east.numOfLane_to
                }
            }
            this.laneData.south.lane_from.push(_laneInfo);
        }
        for(i=0;i<this.laneData.south.numOfLane_to; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: this.laneWidth * this.laneData.west.numOfLane_from
                }
            }
            this.laneData.south.lane_to.push(_laneInfo);
        }
        if(this.laneData.east.numOfLane_to>=this.laneData.west.numOfLane_from)
        {
            this.laneData.south.stopLine.y = this.laneData.east.numOfLane_to*this.laneWidth*1.1;
        }else
        {
            this.laneData.south.stopLine.y = this.laneData.west.numOfLane_from*this.laneWidth*1.1;
        }

        //east
        for(i=0;i<this.laneData.east.numOfLane_from; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: this.laneWidth * this.laneData.north.numOfLane_to
                }
            }
            this.laneData.east.lane_from.push(_laneInfo);
        }
        for(i=0;i<this.laneData.east.numOfLane_to; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: this.laneWidth * this.laneData.south.numOfLane_from
                }
            }
            this.laneData.east.lane_to.push(_laneInfo);
        }
        if(this.laneData.north.numOfLane_to>=this.laneData.south.numOfLane_from)
        {
            this.laneData.east.stopLine.y = this.laneData.north.numOfLane_to*this.laneWidth*1.1;
        }else
        {
            this.laneData.east.stopLine.y = this.laneData.south.numOfLane_from*this.laneWidth*1.1;
        }

        //west
        for(i=0;i<this.laneData.west.numOfLane_from; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: this.laneWidth * this.laneData.south.numOfLane_to
                }
            }
            this.laneData.west.lane_from.push(_laneInfo);
        }
        for(i=0;i<this.laneData.west.numOfLane_to; ++i)
        {
            const _laneInfo = {
                index: i,
                coordinate:{
                    x: this.laneWidth * (i+0.5),
                    y: this.laneWidth * this.laneData.north.numOfLane_from
                }
            }
            this.laneData.west.lane_to.push(_laneInfo);
        }
        if(this.laneData.north.numOfLane_from>=this.laneData.south.numOfLane_to)
        {
            this.laneData.west.stopLine.y = -this.laneData.north.numOfLane_from*this.laneWidth*1.1;
        }else
        {
            this.laneData.west.stopLine.y = -this.laneData.south.numOfLane_to*this.laneWidth*1.1;
        }
    }


    // this function is kind of hard coded algorithem for drawing road rendering graphic data
    cookGraphicRenderData(window_width, window_height){
        const _w = window_width/2;
        const _h = window_height/2;
        var _data = [];

        const _base_color = 0x575757;
        const _side_walk_color = 0xcccccc;
        var i = 0;

        //road base
        const _data_road_base = this.cookGraphicRenderData_roadBase(window_width,window_height);

        for(i=0;i<_data_road_base.length;++i)
        {
            _data.push(_data_road_base[i]);
        }


        return _data;

    }

    //graphic function for road base
    cookGraphicRenderData_roadBase(window_width, window_height)
    {
        const _w = window_width/2;
        const _h = window_height/2;
        var _data = [];

        //road base
        const _base_color = 0x575757;
        //core
        //north
        // from n
        const _lineData_from_n_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.north.numOfLane_from,
            start: {
                x: - this.laneData.north.numOfLane_from/2 *this.laneWidth,
                y: 0
            },
            end: {
                x: - this.laneData.north.numOfLane_from/2 *this.laneWidth,
                y: - _h
            }
        }

        _data.push(_lineData_from_n_base);

        // to n
        const _lineData_to_n_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.north.numOfLane_to,
            start: {
                x: this.laneData.north.numOfLane_to/2 *this.laneWidth,
                y: 0
            },
            end: {
                x: this.laneData.north.numOfLane_to/2 *this.laneWidth,
                y: - _h
            }
        }

        _data.push(_lineData_to_n_base);

        //south
        // from s
        const _lineData_from_s_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.south.numOfLane_from,
            start: {
                x: this.laneData.south.numOfLane_from/2 *this.laneWidth,
                y: 0
            },
            end: {
                x: this.laneData.south.numOfLane_from/2 *this.laneWidth,
                y: _h
            }
        }

        _data.push(_lineData_from_s_base);

        // to s
        const _lineData_to_s_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.south.numOfLane_to,
            start: {
                x: - this.laneData.south.numOfLane_to/2 *this.laneWidth,
                y: 0
            },
            end: {
                x: - this.laneData.south.numOfLane_to/2 *this.laneWidth,
                y: _h
            }
        }

        _data.push(_lineData_to_s_base);

        //east
        // from e
        const _lineData_from_e_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.east.numOfLane_from,
            start: {
                x: 0,
                y: - this.laneData.east.numOfLane_from/2 *this.laneWidth
            },
            end: {
                x: _w,
                y: - this.laneData.east.numOfLane_from/2 *this.laneWidth
            }
        }

        _data.push(_lineData_from_e_base);

        // to e
        const _lineData_to_e_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.east.numOfLane_to,
            start: {
                x: 0,
                y: this.laneData.east.numOfLane_to/2 *this.laneWidth
            },
            end: {
                x: _w,
                y: this.laneData.east.numOfLane_to/2 *this.laneWidth
            }
        }

        _data.push(_lineData_to_e_base);

        //west
        // from w
        const _lineData_from_w_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.west.numOfLane_from,
            start: {
                x: 0,
                y: this.laneData.west.numOfLane_from/2 *this.laneWidth
            },
            end: {
                x: - _w,
                y: this.laneData.west.numOfLane_from/2 *this.laneWidth
            }
        }

        _data.push(_lineData_from_w_base);

        // to e
        const _lineData_to_w_base = {
            color: _base_color,
            width: this.laneWidth * this.laneData.west.numOfLane_to,
            start: {
                x: 0,
                y: - this.laneData.west.numOfLane_to/2 *this.laneWidth
            },
            end: {
                x: - _w,
                y: - this.laneData.west.numOfLane_to/2 *this.laneWidth
            }
        }

        _data.push(_lineData_to_w_base);


        //return graphic data

        return _data;

    }

    //graphic function for side walk
    cookGraphicRenderData_sideWalk(window_width, window_height)
    {
        const _w = window_width/2;
        const _h = window_height/2;
        var _data = [];
        //side walk
        const _side_walk_color = 0xcccccc;

        //north = 

    }

}