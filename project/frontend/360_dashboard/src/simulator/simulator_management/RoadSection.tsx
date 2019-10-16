import Lane from './Lane';

/**
 * @class RoadSection
 */
export default class RoadSection {

    id:number;
    roadSection_id:number;
    roadIntersection_id:number;
    head:{x:number,y:number};
    tail:{x:number,y:number};
    lane_in: Array<Lane>;
    lane_out: Array<Lane>;

    constructor(id:number, roadSection_id:number, roadIntersection_id:number, tailCoordinate:{x:number,y:number})
    {
        this.id = id;
        this.roadSection_id = roadSection_id;
        this.roadIntersection_id = roadIntersection_id;
        this.head = {x:0,y:0};
        this.tail = tailCoordinate;
        this.lane_in = new Array<Lane>();
        this.lane_out = new Array<Lane>();
    }

}
