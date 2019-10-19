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
    getLaneId(): number {
        return this.id;
    }
    getLaneType(): string {
        return this.laneType;
    }
    getLaneDirection(): number {
        return this.laneDirection;
    }
    getRoadSectionId(): number {
        return this.roadSection_id;
    }
    getRoadIntersectionId(): number {
        return this.roadIntersection_id
    }
    getObjectsOnLane(): Array<Object> {
        return this.objects;
    }
    getHead(): number {
        return this.head;
    }
    getTail(): number {
        return this.tail;
    }
    getStart(): Coordinate {
        return this.start;
    }
    getEnd(): Coordinate {
        return this.end;
    }
    getTrafficLightId(): number {
        return this.trafficLight_id;
    }

    //Setters
    setLaneType(laneType: string) {
        this.laneType = laneType;
    }
    setRoadSectionId(roadSection_id: number) {
        this.roadSection_id = roadSection_id;
    }
    setroadIntersectionId(roadIntersection_id: number) {
        this.roadIntersection_id = roadIntersection_id;
    }
    setHead(head: number) {
        this.head = head;
    }
    setTail(tail: number) {
        this.tail = tail;
    }
    setStart(start: Coordinate) {
        this.start = start;
    }
    setEnd(end: Coordinate) {
        this.end = end;
    }

    addVehicle(VehicleObj:Vehicle)
    {
        this.objects.push(VehicleObj);
    }

}

