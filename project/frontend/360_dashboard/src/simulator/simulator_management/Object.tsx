/**
 * @class Object
 */

import Coordinate from "./Coordinate";

export default class Object {
    
    id:number;
    lane_id:number;
    roadSection_id:number;
    coordinate: Coordinate;
    //State: move, stop
    state: string;
    speed: number;

    //roadIntersection_id:number;
    //state:string;
    // REPLACED BY COORDINATE CLASS
    // position:{
    //     x:number,y:number
    // };
    
    constructor(id:number, coordinate:Coordinate, lane_id:number, roadSection_id:number, speed:number){
       this.id = id;
       this.coordinate = new Coordinate();
       this.lane_id = lane_id;
       this.roadSection_id = roadSection_id;
       this.state = "stop"
       this.speed = speed;
    }

    //Getters
    private getObjectId() {
        return this.id;
    }
    private getLaneId() {
        return this.lane_id;
    }
    private getRoadSectionId(){
        return this.roadSection_id;
    }
    private getCoordinate(){
        return this.coordinate;
    }

    //Setters
    private setCoordinate(coordinate: Coordinate) {
        this.coordinate = coordinate;
    }
    private setLaneId(lane_id: number) {
        this.lane_id = lane_id;
    }
    private setRoadSectionId(roadSection_id: number) {
        this.roadSection_id = roadSection_id;
    }
    private setState(state: string) {
        this.state = state;
    }
    private setObjectSpeed(speed: number) {
        this.speed = speed;
    }

}
