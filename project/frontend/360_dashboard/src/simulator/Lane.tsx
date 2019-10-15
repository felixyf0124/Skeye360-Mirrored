import Vehicle from './Vehicle';

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
    start:{x:number,y:number};
    end:{x:number,y:number};
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
        this.start = {x:0,y:0};
        this.end = {x:0,y:0};
        this.trafficLight_id = 0;
    }

    addVehicle(VehicleObj:Vehicle)
    {
        this.objects.push(VehicleObj);
    }

}

