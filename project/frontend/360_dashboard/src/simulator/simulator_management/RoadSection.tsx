import Lane from './Lane';
import Coordinate from './Coordinate';

/**
 * @class RoadSection
 */
export default class RoadSection {

    id:number;
    // roadSection_id:number;
    roadIntersection_id:number;
    // head:{x:number,y:number};
    // tail:{x:number,y:number};
    head: Coordinate;
    tail: Coordinate;
    lane_in: Array<Lane>;
    lane_out: Array<Lane>;

    //tailCoordinate was tailCoordinate:{x:number,y:number} in the paramenter of the constructor
    constructor(id:number, roadIntersection_id:number, tailCoordinate:Coordinate)
    {
        this.id = id;
        this.roadIntersection_id = roadIntersection_id;
        // this.head = {x:0,y:0};
        // this.tail = tailCoordinate;
        this.head = new Coordinate();
        this.tail = tailCoordinate;
        this.lane_in = new Array<Lane>();
        this.lane_out = new Array<Lane>();
    }

    //Getters
    private getRoadSectionId() {
        return this.id;
    }
    private getRoadIntersectionId() {
        return this.roadIntersection_id;
    }
    private getHead() {
        return this.head;
    }
    private getTail() {
        return this.tail;
    }
    private getLaneIn() {
        return this.lane_in;
    }
    private getLaneOut() {
        return this.lane_out;
    }

    //Setters
    private setHead(head: Coordinate) {
        this.head = head;
    }
    private setTail(tail: Coordinate) {
        this.tail = tail;
    }

}
