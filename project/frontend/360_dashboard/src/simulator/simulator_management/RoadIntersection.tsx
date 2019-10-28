import RoadSection from './RoadSection';
import vec2 from './vec2';
import TLManager from './TrafficLightManager';
import * as ts from '../TSGeometry';
import Lane from './Lane';
import './LanePointer';
import LanePointer from './LanePointer';
import TrafficLightManager from './TrafficLightManager';
import { number } from 'prop-types';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    // mapCoordinate:{x:number,y:number};
    mapCoordinate: vec2;
    roadSections:Array<RoadSection>;
    TLManager:TLManager;
    laneWidth:number;

    constructor(id:number, TLManager: TrafficLightManager, mapCoordinate:vec2)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = TLManager;
        this.laneWidth =0;
    }

    //Getters
    getRoadIntersectionId(): number {
        return this.id;
    }
    getMapCoordinate(): vec2 {
        return this.mapCoordinate;
    }
    getRoadSections(): Array<RoadSection> {
        return this.roadSections;
    }

    getTrafficLightState(id:number):string{
        return this.TLManager.getTrafficLightState(id);
    }

    getLaneState(section_id:number,lane_id:number, isLaneIn?:boolean):string{
        const _isLaneIn:boolean = isLaneIn||true;
        const _trafficLight_id = this.roadSections[section_id].getLaneAt(lane_id,_isLaneIn).getTrafficLightId();
        return this.getTrafficLightState(_trafficLight_id);
    }

    //Setters
    setMapCoordinate(mapCoordinate: vec2) {
        this.mapCoordinate = mapCoordinate;
    }
    /**
     * This also updates all lane positions
     * @param width 
     */
    setLaneWidth(width:number){
        this.laneWidth = width;
    }

    updateLane() {
        this.resortRoadSections();

        for(let i=0;i<this.roadSections.length;++i){
            this.roadSections[i].updateLanePosition(this.laneWidth);
        }

        var _intersections = new Array<Array<vec2>>();
        for(let i = 0; i < this.roadSections.length; ++i){
            // var _intersection_left = new vec2();
            // var _intersection_right = new vec2();
            //check left side
            const _lane_out = this.roadSections[i].getLaneAt(this.roadSections[i].lane_out.length-1, false);
            const _line_left = ts.line(_lane_out.getHead(), _lane_out.getTail());
            
            const _lane_in = this.roadSections[i].getLaneAt(this.roadSections[i].lane_in.length-1);
            const _line_right = ts.line(_lane_in.getHead(), _lane_in.getTail());

            const _i_left = (i-1+this.roadSections.length)%this.roadSections.length;
            const _lane_right_L_sec = this.roadSections[_i_left]
                .getLaneAt(this.roadSections[_i_left].lane_in.length-1);
            var _edge_right_L_sec = ts.line(_lane_right_L_sec.getHead(), _lane_right_L_sec.getTail());

            var _lane_dir = ts.tsNormalize(_lane_right_L_sec.getHead().minus(_lane_right_L_sec.getTail()));
            var _perpendicular_unit_vec = ts.tsRotateByOrigin(_lane_dir, Math.PI/2);
            const _offset_right_shift = _perpendicular_unit_vec.multiply(this.laneWidth * 0.5);

            const _i_right = (i+1+this.roadSections.length)%this.roadSections.length;
            const _lane_left_R_sec = this.roadSections[_i_right]
                .getLaneAt(this.roadSections[_i_right].lane_out.length-1,false);
            var _edge_left_R_sec = ts.line(_lane_left_R_sec.getHead(), _lane_left_R_sec.getTail());
            
        console.log('id ' + i );
        // console.log(_edge_right_L_sec);
           // console.log(_edge_left_R_sec);
    
            _lane_dir = ts.tsNormalize(_lane_left_R_sec.getHead().minus(_lane_left_R_sec.getTail()));
            _perpendicular_unit_vec = ts.tsRotateByOrigin(_lane_dir, Math.PI/2);
            const _offset_left_shift = _perpendicular_unit_vec.multiply(this.laneWidth * 0.5);
            //edge right 
            _edge_right_L_sec = ts.lineShift(_edge_right_L_sec, _offset_right_shift);
            // _edge_right_L_sec = ts.line(_lane_right_L_sec.getHead().plus(_offset_right_shift), 
            //         _lane_right_L_sec.getHead().plus(_offset_right_shift));
            //edge left 
            _edge_left_R_sec = ts.lineShift(_edge_left_R_sec, _offset_left_shift);
            // _edge_left_R_sec = ts.line(_lane_left_R_sec.getHead().plus(_offset_left_shift), 
            //         _lane_left_R_sec.getHead().plus(_offset_left_shift));
            if(i ===2)
         { console.log(_line_left);
        console.log(_edge_right_L_sec);}

            const _intersection_left = ts.lineIntersection(_line_left,_edge_right_L_sec);
            if(i ===2)
            { console.log(_line_left);
           console.log(_edge_right_L_sec);}
   
            const _intersection_right = ts.lineIntersection(_line_right,_edge_left_R_sec);

        // console.log(_edge_right_L_sec);
        // console.log(_edge_left_R_sec);
        // console.log(_line_left);
        // console.log(_line_right);
        console.log(_intersection_left);
        console.log(_intersection_right);
            _intersections.push([_intersection_left,_intersection_right]);
        

            //temp solution
        const _direct = ts.tsNormalize(this.roadSections[i].getTail().minus(this.roadSections[i].getHead()));
        console.log('_direct');
        console.log(_direct);
        this.roadSections[i].offsetLanes(_direct.multiply(3*this.laneWidth));
            // update lanes of the roadSection with the intersection offset
            // if(i !==2)
           // this.roadSections[i].updateLaneWithOffset(_intersection_left,_intersection_right);
        }
        return _intersections;
    }

    resortRoadSections(){
        var _resort = new Array<{index:number,angle:number}>();

        for(let i = 0; i < this.roadSections.length; ++i)
        {
            const _vec = this.roadSections[i].getTail().minus(this.roadSections[i].getHead());
            _vec.y *= -1;
            var _ang = ts.getAngleOfVec(_vec)/Math.PI*180;
            if(_vec.x < 0)
            {
                _ang += 180;
            }
            _ang = (_ang + 360)% 360;
            _resort.push({index:i,angle:_ang});
        }

        for(let i=0; i< _resort.length-1; ++i)
        {
            var _min = _resort[i];
            for(let j=_resort.length-1; j>i; --j)
            {
                if(_min.angle>_resort[j].angle)
                {
                    _min = _resort[j];
                    _resort[j] = _resort[i];
                    _resort[i] = _min;
                }
            }
            
        }
        console.log(_resort);
        var _roadSections = new Array<RoadSection>();

        for(let i = 0; i < _resort.length; ++i)
        {
            _roadSections.push(this.roadSections[_resort[i].index]);
        }

        this.roadSections = _roadSections;
        
    }

    addNewRoadSection(tailVec2: vec2) {
        var _roadSection = new RoadSection(this.roadSections.length,this.id,tailVec2);
        console.log(_roadSection);
        this.roadSections.push(_roadSection);
    }
    
    addRoadSection(roadSection: RoadSection) {
        this.roadSections.push(roadSection);
    }

    addNewLane(roadSection_id: number, laneDirection: number, laneType:string, numOfLanes: number) {
        
        this.roadSections[roadSection_id].addNewLane(laneDirection,laneType,numOfLanes);
       
    }

    linkLanes(tail:LanePointer, head:LanePointer){
        this.roadSections[tail.getLaneId()].lane_in[tail.getLaneId()].addHeadLink(head);
        this.roadSections[head.getLaneId()].lane_out[head.getLaneId()].addTailLink(tail);
        
        //TODO
        //should we menually set road direction like straight turn left or right,
        //or make it auto adjusted when the lanes are linked to each other?
    }

    
}