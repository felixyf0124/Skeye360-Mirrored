import RoadSection from './RoadSection';
import Coordinate from './Coordinate';
import TLManager from './TrafficLightManager';
import * as ts from '../TSGeometry';
import Lane from './Lane';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    // mapCoordinate:{x:number,y:number};
    mapCoordinate: Coordinate;
    roadSections:Array<RoadSection>;
    TLManager:TLManager;

    constructor(id:number, mapCoordinate:Coordinate)
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
    getMapCoordinate(): Coordinate {
        return this.mapCoordinate;
    }
    getRoadSections(): Array<RoadSection> {
        return this.roadSections;
    }

    //Setters
    setMapCoordinate(mapCoordinate: Coordinate) {
        this.mapCoordinate = mapCoordinate;
    }

    addNewRoadSection(tailVec2: Coordinate) {
        var _roadSection = new RoadSection(this.roadSections.length,this.id,tailVec2);
        
        this.roadSections.push(_roadSection);
    }
    
    addRoadSection(roadSection: RoadSection) {
        this.roadSections.push(roadSection);
    }

    addNewLane(roadSection_id: number, laneDirection: number, laneType:string) {
        var _id = 0;
        if(laneDirection > 0)
        {
            _id = this.roadSections[_id].lane_in.length;
            var _lane = new Lane(_id, laneType, laneDirection, roadSection_id, this.id);
            this.roadSections[_id].lane_in.push(_lane);
        }else if(laneDirection < 0){
            _id = this.roadSections[_id].lane_out.length;
            var _lane = new Lane(_id, laneType, laneDirection, roadSection_id, this.id);
            this.roadSections[_id].lane_out.push(_lane);
        }else{
            console.error("invalide laneDiection input \n");
        }
       
    }
    addLane(lane: Lane){
        if(lane.laneDirection > 0)
        {
            this.roadSections[lane.roadSection_id].lane_in.push(lane);
        }else if(lane.laneDirection < 0)
        {
            this.roadSections[lane.roadSection_id].lane_out.push(lane);
        }else {
            console.error("invalide laneDiection \n");
        }
    }
}