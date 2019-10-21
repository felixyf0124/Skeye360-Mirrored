import RoadSection from './RoadSection';
import vec2 from './vec2';
import TLManager from './TrafficLightManager';
import * as ts from '../TSGeometry';
import Lane from './Lane';
import './LanePointer';
import LanePointer from './LanePointer';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    // mapCoordinate:{x:number,y:number};
    mapCoordinate: vec2;
    roadSections:Array<RoadSection>;
    TLManager:TLManager;

    constructor(id:number, mapCoordinate:vec2)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = new TLManager(id);
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

    //Setters
    setMapCoordinate(mapCoordinate: vec2) {
        this.mapCoordinate = mapCoordinate;
    }

    addNewRoadSection(tailVec2: vec2) {
        var _roadSection = new RoadSection(this.roadSections.length,this.id,tailVec2);
        
        this.roadSections.push(_roadSection);
    }
    
    addRoadSection(roadSection: RoadSection) {
        this.roadSections.push(roadSection);
    }

    addNewLane(roadSection_id: number, laneDirection: number, laneType:string, numOfLanes: number) {
        
        for(let i = 0; i < numOfLanes; ++i)
        {
            this.roadSections[roadSection_id].addNewLane(laneDirection,laneType,numOfLanes);
        }
       
    }

    linkLanes(tail:LanePointer, head:LanePointer){
        this.roadSections[tail.getLaneId()].lane_in[tail.getLaneId()].addHeadLink(head);
        this.roadSections[head.getLaneId()].lane_out[head.getLaneId()].addTailLink(tail);
        
        //TODO
        //should we menually set road direction like straight turn left or right,
        //or make it auto adjusted when the lanes are linked to each other?
    }
}