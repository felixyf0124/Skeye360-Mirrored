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
    laneWidth:number;

    constructor(id:number, TLManagerId: number, mapCoordinate:vec2)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = new TLManager(TLManagerId, id);
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
        console.log("TESTINGinRI:"+_trafficLight_id);
        return this.getTrafficLightState(_trafficLight_id);
    }

    //Setters
    setMapCoordinate(mapCoordinate: vec2) {
        this.mapCoordinate = mapCoordinate;
    }

    updateLaneWidth(width:number) {
        this.laneWidth = width;
        for(let i=0;i<this.roadSections.length;++i){
            this.roadSections[i].updateLanePosition(width);
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