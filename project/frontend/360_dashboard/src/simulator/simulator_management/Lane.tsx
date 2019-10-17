import Vehicle from './Vehicle';
import Coordinate from './Coordinate';

/**
 * @class Lane
 */
export default class Lane {

    id:number;
    laneType: string;
    //1 or -1 same or opposite with road section
    laneDirection: number;
    roadSection_id: number;
    roadIntersection_id:number
    objects:Array<Object>;
    head:number;
    tail:number;
    // start:{x:number,y:number};
    // end:{x:number,y:number};
    start: Coordinate;
    end: Coordinate;
    trafficLight_id:number;

    constructor(id:number, laneType:string, laneDirection:number, roadSection_id:number, roadIntersection_id:number){
        this.id = id;
        this.laneType = laneType;
        this.laneDirection = laneDirection;
        this.roadSection_id = roadSection_id;
        this.roadIntersection_id = roadIntersection_id;
        this.objects = new Array<Object>();
        // is there anyway to make this null?
        this.head = 0;
        this.tail = 0;
        // this.start = {x:0,y:0};
        // this.end = {x:0,y:0};
        this.start = new Coordinate();
        this.end = new Coordinate();
        this.trafficLight_id = 0;
    }

    //Getters
    private getLaneId() {
        return this.id;
    }
    private getLaneType() {
        return this.laneType;
    }
    private getLaneDirection() {
        return this.laneDirection;
    }
    private getRoadSectionId() {
        return this.roadSection_id;
    }
    private getRoadIntersectionId() {
        return this.roadIntersection_id
    }
    private getObjectsOnLane() {
        return this.objects;
    }
    private getHead() {
        return this.head;
    }
    private getTail() {
        return this.tail;
    }
    private getStart() {
        return this.start;
    }
    private getEnd() {
        return this.end;
    }
    private getTrafficLightId() {
        return this.trafficLight_id;
    }

    //Setters
    private setLaneType(laneType: string) {
        this.laneType = laneType;
    }
    private setRoadSectionId(roadSection_id: number) {
        this.roadSection_id = roadSection_id;
    }
    private setroadIntersectionId(roadIntersection_id: number) {
        this.roadIntersection_id = roadIntersection_id;
    }
    private setHead(head: number) {
        this.head = head;
    }
    private setTail(tail: number) {
        this.tail = tail;
    }
    private setStart(start: Coordinate) {
        this.start = start;
    }
    private setEnd(end: Coordinate) {
        this.end = end;
    }

    addVehicle(VehicleObj:Vehicle)
    {
        this.objects.push(VehicleObj);
    }

}

