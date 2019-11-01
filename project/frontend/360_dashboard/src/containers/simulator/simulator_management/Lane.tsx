import Vehicle from './Vehicle';
import Coordinate from './vec2';
import LanePointer from './LanePointer';

/**
 * @class Lane
 */
export default class Lane {

    id:number;
    laneType: string;
    //1 or -1 same or opposite with road section
    laneDirection: number;
    roadSection_id: number;
    //roadIntersection_id:number
    objects:Array<number>;
    head:Coordinate;
    tail:Coordinate;
    // start:{x:number,y:number};
    // end:{x:number,y:number};
    headLinks: Array<LanePointer>;
    tailLinks: Array<LanePointer>;
    trafficLight_id:number;

    constructor(id:number, laneType:string, laneDirection:number, roadSection_id:number){
        this.id = id;
        this.laneType = laneType;
        this.laneDirection = laneDirection;
        this.roadSection_id = roadSection_id;
        //this.roadIntersection_id = roadIntersection_id;
        this.objects = new Array<number>();
        // is there anyway to make this null?
        // this.start = {x:0,y:0};
        // this.end = {x:0,y:0};
        this.head = new Coordinate();
        this.tail = new Coordinate();
        this.headLinks = new Array<LanePointer>();
        this.tailLinks = new Array<LanePointer>();
        this.trafficLight_id = 0;
    }

    //Getters
    getId(): number {
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
    // getRoadIntersectionId(): number {
    //     return this.roadIntersection_id
    // }
    getObjects(): Array<number> {
        return this.objects;
    }

    
    getHead(): Coordinate {
        return this.head;
    }
    getTail(): Coordinate {
        return this.tail;
    }
    getHeadLink(): Array<LanePointer> {
        return this.headLinks;
    }
    getTailLink(): Array<LanePointer> {
        return this.tailLinks;
    }
    getTrafficLightId(): number {
        return this.trafficLight_id;
    }

    getObjIndex(id:number){
        for(let i =0; i<this.objects.length; ++i)
        {
            if(this.objects[i] === id)
            {
                return i;
            }
        }
        return -1;
    }

    //Setters
    setId(id:number){
        this.id = id;
    }
    setLaneType(laneType: string) {
        this.laneType = laneType;
    }
    setRoadSectionId(roadSection_id: number) {
        this.roadSection_id = roadSection_id;
    }
    // setroadIntersectionId(roadIntersection_id: number) {
    //     this.roadIntersection_id = roadIntersection_id;
    // }
    setHead(head: Coordinate) {
        this.head = head;
    }
    setTail(tail: Coordinate) {
        this.tail = tail;
    }

    bindTrafficLightId(id:number){
        this.trafficLight_id = id;
    }

    addHeadLink(headLink: LanePointer) {
        var _isExisted = false;
        for(let i = 0; i < this.headLinks.length; ++i)
        {
            if(this.headLinks[i].section_id === headLink.section_id && this.headLinks[i].lane_id === headLink.lane_id)
            {
                _isExisted = true;
            }
        }
        if(!_isExisted)
        {
            this.headLinks.push(headLink);
        }
    }

    addTailLink(tailLink: LanePointer) {
        var _isExisted = false;
        for(let i = 0; i < this.tailLinks.length; ++i)
        {
            if(this.tailLinks[i].section_id === tailLink.section_id 
                && this.tailLinks[i].lane_id === tailLink.lane_id)
            {
                _isExisted = true;
            }
        }
        if(!_isExisted)
        {
            this.tailLinks.push(tailLink);
        }
    }

    addObjId(obj_id:number)
    {
        this.objects.push(obj_id);
    }

    clearHeadLinks(){
        this.headLinks = new Array<LanePointer>();
    }

    clearTailLinks(){
        this.tailLinks = new Array<LanePointer>();
    }

    objGone(id:number){
        this.objects.splice(this.getObjIndex(id),1); 
    }

}

