import RoadSection from './RoadSection';
import vec2 from './vec2';
import TLManager from './TrafficLightManager';
import * as ts from '../TSGeometry';
import Lane from './Lane';
import './LanePointer';
import LanePointer from './LanePointer';
import { number } from 'prop-types';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    // mapCoordinate:{x:number,y:number};
    mapCoordinate: vec2;
    roadSections:Array<RoadSection>;
    TLManager:TLManager;
    laneWidth:number;

    constructor(id:number, mapCoordinate:vec2)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = new TLManager(id);
        this.laneWidth =0;
    }

    //Getters
    getRoadIntersectionId(): number {
        return this.id;
    }
    getMapCoordinate(): vec2 {
        return this.mapCoordinate;
    }
    getRoadSections(): Array<RoadSection> {
        return this.roadSections;
    }

    getTrafficLightState(id:number):string{
        return this.TLManager.getTrafficLightState(id);
    }

    getLaneState(section_id:number,lane_id:number, isLaneIn?:boolean):string{
        const _isLaneIn:boolean = isLaneIn||true;
        const _trafficLight_id = this.roadSections[section_id].getLaneAt(lane_id,_isLaneIn).getTrafficLightId();
        
        return this.getTrafficLightState(_trafficLight_id);
    }

    //Setters
    setMapCoordinate(mapCoordinate: vec2) {
        this.mapCoordinate = mapCoordinate;
    }
    /**
     * This also updates all lane positions
     * @param width 
     */
    setLaneWidth(width:number){
        this.laneWidth = width;
    }

    updateLane() {
        for(let i=0;i<this.roadSections.length;++i){
            this.roadSections[i].updateLanePosition(this.laneWidth);
        }
        var _resort = new Array<{left:number,right:number}>();
        for(let i = 0; i < this.roadSections.length; ++i){
            var _intersection = new vec2();
            //check left side
            var _lane = this.roadSections[i].getLaneAt(this.roadSections[i].lane_out.length-1, false);
            const _line_left = ts.line(_lane.getHead(), _lane.getTail());
            for(let j = 0; j < this.roadSections.length; ++j)
            {
                if(j != i)
                {
                    var _lane_right = this.roadSections[j].getLaneAt(j);
                    var _line = ts.line(_lane_right.getHead(), _lane_right.getTail());
                    var _lane_dir = ts.tsNormalize(_lane_right.getHead().minus(_lane_right.getTail()));
                    var _perpendicular_unit_vec = ts.tsRotateByOrigin(_lane_dir, Math.PI/2);
                    _line = ts.lineShift(_line, _perpendicular_unit_vec);

                    _intersection = ts.lineIntersection(_line_left,_line);

                    const _distance = ts.tsLength(_intersection.minus(_lane.getTail()));
                    const _length = ts.tsLength(_lane_right.getHead().minus(_lane_right.getTail()));
                    if(_distance <= _length)
                    {
                        let _isExisted = false;
                        for(let k=0;k<_resort.length;++k)
                        {
                            if(_resort[k].left === j && _resort[k].right === i)
                            {
                                _isExisted = true;
                                break;
                            }
                        }
                        if(!_isExisted)
                        {
                            _resort.push({left:j,right:i});
                        }
                    }
                }

            }

            //check right side
            //todo
            //_lane =
        }

    }


    addNewRoadSection(tailVec2: vec2) {
        var _roadSection = new RoadSection(this.roadSections.length,this.id,tailVec2);
        console.log(_roadSection);
        this.roadSections.push(_roadSection);
    }
    
    addRoadSection(roadSection: RoadSection) {
        this.roadSections.push(roadSection);
    }

    addNewLane(roadSection_id: number, laneDirection: number, laneType:string, numOfLanes: number) {
        
        this.roadSections[roadSection_id].addNewLane(laneDirection,laneType,numOfLanes);
       
    }

    linkLanes(tail:LanePointer, head:LanePointer){
        this.roadSections[tail.getLaneId()].lane_in[tail.getLaneId()].addHeadLink(head);
        this.roadSections[head.getLaneId()].lane_out[head.getLaneId()].addTailLink(tail);
        
        //TODO
        //should we menually set road direction like straight turn left or right,
        //or make it auto adjusted when the lanes are linked to each other?
    }

    
}