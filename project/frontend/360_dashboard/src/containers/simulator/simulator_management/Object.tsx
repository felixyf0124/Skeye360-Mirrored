/**
 * @class Object
 */

import vec2 from "./vec2";

export default class Object {
    
    id:number;
    lane_id:number;
    roadSection_id:number;
    position: vec2;
    //State: move, stop
    state: string;
    speed: number;

    //roadIntersection_id:number;
    //state:string;
    // REPLACED BY COORDINATE CLASS
    // position:{
    //     x:number,y:number
    // };
    
    constructor(id:number, lane_id:number, roadSection_id:number, speed:number, position?:vec2){
       this.id = id;
       this.position = position||new vec2();
       this.lane_id = lane_id;
       this.roadSection_id = roadSection_id;
       this.state = "stop"
       this.speed = speed;
    }

    //Getters
    getId(): number {
        return this.id;
    }
    getLaneId(): number {
        return this.lane_id;
    }
    getRoadSectionId(): number {
        return this.roadSection_id;
    }
    getPosition(): vec2{
        return this.position;
    }
    getSpeed(){
        return this.speed;
    }

    //Setters
    setPosition(position: vec2) {
        this.position = position;
    }
    setLaneId(lane_id: number) {
        this.lane_id = lane_id;
    }
    setRoadSectionId(roadSection_id: number) {
        this.roadSection_id = roadSection_id;
    }
    setState(state: string) {
        this.state = state;
    }
    setObjectSpeed(speed: number) {
        this.speed = speed;
    }

}
