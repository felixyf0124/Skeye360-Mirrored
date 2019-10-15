
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
    object_ids:Array<number>;
    head_id:number;
    tail_id:number;
    trafficLight_id:number;

    constructor(id:number, laneType:string, laneDirection:number, roadSection_id:number, roadIntersection_id:number){
        this.id = id;
        this.laneType = laneType;
        this.laneDirection = laneDirection;
        this.roadSection_id = roadSection_id;
        this.roadIntersection_id = roadIntersection_id;
        this.object_ids = new Array<number>();
        this.head_id = -1;
        this.tail_id = -1;
        this.trafficLight_id = -1;
    }
}

