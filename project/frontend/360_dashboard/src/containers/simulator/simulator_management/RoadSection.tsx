import Lane from './Lane';
import vec2 from './vec2';
import * as ts from '../TSGeometry';

/**
 * @class RoadSection
 */
export default class RoadSection {

    id:number;
    // roadSection_id:number;
    roadIntersection_id:number;
    // head:{x:number,y:number};
    // tail:{x:number,y:number};
    head: vec2;
    tail: vec2;
    lane_in: Array<Lane>;
    lane_out: Array<Lane>;

    //tailCoordinate was tailCoordinate:{x:number,y:number} in the paramenter of the constructor
    constructor(id:number, roadIntersection_id:number, tailCoordinate:vec2)
    {
        this.id = id;
        this.roadIntersection_id = roadIntersection_id;
        // this.head = {x:0,y:0};
        // this.tail = tailCoordinate;
        this.head = new vec2();
        this.tail = tailCoordinate;
        this.lane_in = new Array<Lane>();
        this.lane_out = new Array<Lane>();
    }

    //Getters
    getId(): number {
        return this.id;
    }
    getRoadIntersectionId(): number {
        return this.roadIntersection_id;
    }
    getHead(): vec2 {
        return this.head;
    }
    getTail(): vec2 {
        return this.tail;
    }
    getLaneIn(): Array<Lane> {
        return this.lane_in;
    }
    getLaneOut(): Array<Lane> {
        return this.lane_out;
    }
    getLaneAt(id:number,isLaneIn?:boolean){
        const _isLaneIn:boolean = isLaneIn||true;
        if(_isLaneIn){
            return this.lane_in[id];
        }else{
            return this.lane_out[id];
        }
    }

    //Setters
    setId(id:number){
        this.id = id;
        for(let i = 0; i < this.lane_in.length; ++i)
        {
            this.lane_in[i].setRoadSectionId(this.id);
        }
        for(let i = 0; i < this.lane_out.length; ++i)
        {
            this.lane_out[i].setRoadSectionId(this.id);
        }
    }
    setHead(head: vec2) {
        this.head = head;
    }
    setTail(tail: vec2) {
        this.tail = tail;
    }

    addNewLane(laneDirection: number, laneType:string, numOfLanes:number){
        var _id = 0;
        for(let i = 0; i < numOfLanes; ++i)
        {
            if(laneDirection > 0)
            {
                _id = this.lane_in.length;
                var _lane = new Lane(_id, laneType, laneDirection, this.id);
                _lane.setHead(this.head);
                _lane.setTail(this.tail);
                this.lane_in.push(_lane);
            }else if(laneDirection < 0){
                _id = this.lane_out.length;
                var _lane = new Lane(_id, laneType, laneDirection, this.id);
                _lane.setHead(this.tail);
                _lane.setTail(this.head);
                this.lane_out.push(_lane);
            }else{
                console.error("invalide laneDiection input \n");
            }
        }
    }

    updateLanePosition(laneWidth:number){
        for(let i = 0; i<this.lane_in.length;++i)
        {
            var _lane_direction = ts.tsNormalize(this.head.minus(this.tail));
            const _perpendicular_unit_vec = ts.tsRotateByOrigin(_lane_direction, Math.PI/2);
            var _perpendicular_offset = _perpendicular_unit_vec.multiply((i+0.5)*laneWidth);

            this.lane_in[i].setHead(this.head.plus(_perpendicular_offset));
            this.lane_in[i].setTail(this.tail.plus(_perpendicular_offset));
        }

        for(let i = 0; i<this.lane_out.length;++i)
        {
            var _lane_direction = ts.tsNormalize(this.tail.minus(this.head));
            var _perpendicular_unit_vec = ts.tsRotateByOrigin(_lane_direction, Math.PI/2);

            var _perpendicular_offset = _perpendicular_unit_vec.multiply((i+0.5)*laneWidth);

            this.lane_out[i].setHead(this.tail.plus(_perpendicular_offset));
            this.lane_out[i].setTail(this.head.plus(_perpendicular_offset));
        }
    }

    updateLaneWithOffset(leftOffset:vec2, rightOffset:vec2){
        console.log("sadadsa");
        console.log(leftOffset);
        console.log(rightOffset);
        const _offset_line = ts.line(leftOffset,rightOffset);
        for(let i = 0; i < this.lane_in.length; ++i)
        {
            const _lane_line = ts.line(this.lane_in[i].getTail(),this.lane_in[i].getHead());
            console.log(_offset_line);
            console.log('_lane_line');
            console.log(_lane_line);
            const _intersection = ts.lineIntersection(_offset_line, _lane_line);
            this.lane_in[i].setHead(_intersection);
        }

        for(let i = 0; i < this.lane_out.length; ++i)
        {
            const _lane_line = ts.line(this.lane_out[i].getTail(),this.lane_out[i].getHead());
            const _intersection = ts.lineIntersection(_offset_line, _lane_line);
            this.lane_out[i].setTail(_intersection);
        }
    }

    offsetLanes(offset:vec2){
        for(let i = 0; i < this.lane_in.length; ++i)
        {
            this.lane_in[i].setHead(this.lane_in[i].getHead().plus(offset));
            this.lane_in[i].setTail(this.lane_in[i].getTail().plus(offset));
        }
        for(let i = 0; i < this.lane_out.length; ++i)
        {
            this.lane_out[i].setHead(this.lane_out[i].getHead().plus(offset));
            this.lane_out[i].setTail(this.lane_out[i].getTail().plus(offset));
        }

    }

}
