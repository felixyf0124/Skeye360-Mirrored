import RoadSection from './RoadSection';
import vec2 from './vec2';
import TLManager from './TrafficLightManager';
import * as ts from '../TSGeometry';
import Lane from './Lane';
import './LanePointer';
import LanePointer from './LanePointer';
import TrafficLightManager from './TrafficLightManager';
import { number } from 'prop-types';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';

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
    vehicles:Array<Vehicle>;
    vehicleCount:number;

    constructor(id:number, mapCoordinate:vec2, TLManager?: TrafficLightManager)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = TLManager||new TrafficLightManager(id);
        this.laneWidth =0;
        this.vehicles = new Array<Vehicle>();
        this.vehicleCount = 0;
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

    getRoadSection(id:number) {
        for(let i = 0; i < this.roadSections.length; ++i)
        {
            if(this.roadSections[i].getId() === id)
            {
                return this.roadSections[i];
            }
        }
        return new RoadSection(-1,-1,new vec2());
    }
    
    getRoadSectionIndex(id:number):number {
        var _index = -1;
        for(let i = 0; i < this.roadSections.length; ++i)
        {
            if(this.roadSections[i].getId() === id)
            {
                _index = i;
                break;
            }
        }
        return _index;
    }

    getLane(lane_id:number,section_id:number,isLaneIn?:boolean) {
        const _lane = this.getRoadSection(section_id).getLaneAt(lane_id,isLaneIn);
        return _lane;
    }

    getTrafficLightQueue() {
        return this.TLManager.getTrafficLightQueue();
    }

    getTrafficLightState(id:number):string {
        return this.TLManager.getTrafficLightState(id);
    }

    getTrafficLightCD(id:number):number {
        return Math.round(this.TLManager.getTrafficLightCD(id));
    }

    getLaneState(section_id:number,lane_id:number, isLaneIn?:boolean):string {
        const _isLaneIn:boolean = isLaneIn||true;
        if(_isLaneIn) {
            const _trafficLight_id = this.roadSections[this.getRoadSectionIndex(section_id)].getLaneAt(lane_id).getTrafficLightId();
            return this.getTrafficLightState(_trafficLight_id);
        } else {
            return "green";
        }
        
    }

    getVehicle(id:number) {
        for(let i = 0; i < this.vehicles.length; ++i) {
            if(this.vehicles[i].getId() === id) {
                return this.vehicles[i];
            }
        }
        return  new Vehicle(-1,-1,-1,-1);
    }

    getVehicles() {
        return this.vehicles;
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

    addNewTrafficLight(laneGroup:Array<{section:number,id:number}>,time:number,specifiedYellowTime?:number){
        this.TLManager.addTrafficLight(laneGroup,time,specifiedYellowTime);
        //add TL id to lanes
        
        this.bindTrafficLight(this.TLManager.getTrafficLightQueue()[this.TLManager.getTrafficLightQueue().length-1]);
    }

    addNewVehicle(lane_id:number,section_id:number,speed:number,vehicle_id?:number,position?:vec2)
    {
        var _vehicle_id = vehicle_id;
        if(_vehicle_id === undefined){
            _vehicle_id =  parseInt(Date.now().toString() + "" + Math.round(Math.random()*1000));
        }
        const _obj_v = new Vehicle(_vehicle_id,lane_id,section_id,speed,position);
        
        this.roadSections[this.getRoadSectionIndex(_obj_v.getRoadSectionId())].lane_in[_obj_v.getLaneId()].addObjId(_obj_v.getId());
        const _lane_from = this.getLane(lane_id,section_id);
        const _lane_pointer = _lane_from.getHeadLink();
        const _lane_to = this.getLane(_lane_pointer[0].getLaneId(),_lane_pointer[0].getSectionId(),false);
        //safety dis
        const _safety_dis = 35;

        _obj_v.path.push([_lane_from.getTail(),_lane_from.getHead()]);
        _obj_v.path.push([_lane_from.getHead(),_lane_to.getTail()]);
        _obj_v.path.push([_lane_to.getTail(),_lane_to.getHead()]);

        const _dir = ts.tsNormalize(_lane_from.getHead().minus(_lane_from.getTail()));
        
        if(_lane_from.getObjIndex(_obj_v.getId()) > 0) {
            const _front_v = this.getVehicle(_lane_from.getObjects()[_lane_from.getObjIndex(_obj_v.getId())-1])
            const _front_pos = _front_v.getPosition().minus(_dir.multiply(_safety_dis));
            let _dis1 = ts.tsLength(_front_pos.minus(_lane_from.getHead()));
            let _dis2 = ts.tsLength(_lane_from.getTail().minus(_lane_from.getHead()));
            if(_dis1<_dis2) {
                _obj_v.setPosition(_lane_from.getTail());
            } else {
                _obj_v.setPosition(_front_pos);
            }

        } else {
            _obj_v.setPosition(_lane_from.getTail());
        }
        this.vehicles.push(_obj_v);
        ++this.vehicleCount;
    }

    bindTrafficLight(trafficLight:TrafficLight) {
        const _toBeBound = trafficLight.getBoundLanes();
        for(let i = 0; i < _toBeBound.length; ++i) {
            let _index = this.getRoadSectionIndex(_toBeBound[i].section);
            this.roadSections[_index].bindTrafficLightId(_toBeBound[i].id, trafficLight.getId());
        }
    }

    forceTLState(id:number, state:string) {
        this.TLManager.forceState(id, state);
    }

    deForceTLState(id:number) {
        this.TLManager.deForceState(id);
    }

    updateLane() {
        this.resortRoadSections();

        for(let i=0;i<this.roadSections.length;++i){
            this.roadSections[i].updateLanePosition(this.laneWidth);
        }

        var _intersections = new Array<Array<vec2>>();
        for(let i = 0; i < this.roadSections.length; ++i) {
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
            
    
            _lane_dir = ts.tsNormalize(_lane_left_R_sec.getHead().minus(_lane_left_R_sec.getTail()));
            _perpendicular_unit_vec = ts.tsRotateByOrigin(_lane_dir, Math.PI/2);
            const _offset_left_shift = _perpendicular_unit_vec.multiply(this.laneWidth * 0.5);
            //edge right 
            _edge_right_L_sec = ts.lineShift(_edge_right_L_sec, _offset_right_shift);
            //edge left 
            _edge_left_R_sec = ts.lineShift(_edge_left_R_sec, _offset_left_shift);

            const _intersection_left = ts.lineIntersection(_line_left,_edge_right_L_sec);
   
            const _intersection_right = ts.lineIntersection(_line_right,_edge_left_R_sec);

            _intersections.push([_intersection_left,_intersection_right]);
            
            this.roadSections[i].updateLaneWithOffset(_intersection_left,_intersection_right);

        }
        return _intersections;
    }

    resortRoadSections() {
        var _resort = new Array<{index:number,angle:number}>();

        for(let i = 0; i < this.roadSections.length; ++i) {
            const _vec = this.roadSections[i].getTail().minus(this.roadSections[i].getHead());
            _vec.y *= -1;
            var _ang = ts.getAngleOfVec(_vec)/Math.PI*180;
            if(_vec.x < 0) {
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

    resortTrafficLightQueue() {
        let _resort = new Array<number>();
        for(let i = 0; i < this.roadSections.length; ++i)
        {
            for(let j = 0; j < this.roadSections[i].lane_in.length; ++j)
            {
                var _isExisted = false;
                for(let k = 0; k < _resort.length; ++k) {
                    
                   if(_resort[k] === this.roadSections[i].getLaneAt(j).getTrafficLightId()) {
                       _isExisted = true;
                   }
                }
                if(!_isExisted) {
                    _resort.push(this.roadSections[i].getLaneAt(j).getTrafficLightId());
                }
            }
        }
        console.log(_resort.length);
        var _sortedQueue = new Array<TrafficLight>();
        for(let i = 0; i < _resort.length; ++i) {
            _sortedQueue.push(this.TLManager.getTrafficLight(_resort[i]));
        }
        this.TLManager.setTrafficLightQueue(_sortedQueue);
        this.TLManager.initialUpdate();
        console.log(this.TLManager.getTrafficLightQueue());
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

    linkLanes(tail:LanePointer, head:LanePointer) {
        this.roadSections[tail.getSectionId()].lane_in[tail.getLaneId()].addHeadLink(head);
        this.roadSections[head.getSectionId()].lane_out[head.getLaneId()].addTailLink(tail);
        
        //TODO
        //should we menually set road direction like straight turn left or right,
        //or make it auto adjusted when the lanes are linked to each other?
    }

    /**
     * tl couting down
     */
    tlCountingDown():boolean {
        return this.TLManager.initialUpdate();
    }

    isForced(tl_id:number) {
        return this.TLManager.getTrafficLight(tl_id).getIsForced();
    }

    isBlink(ratio?:number) {
        return this.TLManager.isBlink(ratio);
    }

    updateVehiclePos() {
        for(let i=0;i<this.vehicles.length;++i) {
            const _id = this.vehicles[i].getId();
            var _front_v; 
            if(this.vehicles[i].getAtPathSection() > 0 || this.getVehicleIndex(_id) <=0){
                _front_v = undefined;
            }else{
                _front_v = this.getFrontVehicle(_id);
            }
            if(_front_v !== undefined)
            {
                this.vehicles[i].checkFront(_front_v.getPosition(),30,_front_v.getSpeed());
            }else{
                if(this.vehicles[i].getAtPathSection() === 0){
                    const _section_id = this.vehicles[i].getRoadSectionId();
                    const _lane_id = this.vehicles[i].getLaneId();
                    const _tl_id = this.roadSections[this.getRoadSectionIndex(_section_id)].getLaneAt(_lane_id).getTrafficLightId();
                    const _tl_state = this.getTrafficLightState(_tl_id);
                    const _tl_cd = this.getTrafficLightCD(_tl_id);
                    if(_tl_state === "red" || (_tl_state === "yellow" && _tl_cd < 3 )){
                        this.vehicles[i].checkFront(this.getLane(_lane_id,_section_id).getHead(),
                        16,0);
                    }else{
                        this.vehicles[i].updateSpeed();
                    }
                }
            }
            this.vehicles[i].updatePosition(this.vehicles[i].getSpeed()*this.vehicles[i].getDeltaT());
        }
        this.checkTransitionVehicle();
       while(this.checkLeavingVehicle());
    }

    getFrontVehicle(id:number) {
        const _vehicle = this.getVehicle(id)

        const _lane = this.getLane(_vehicle.getLaneId(),_vehicle.getRoadSectionId())
        const _index = _lane.getObjIndex(id);
        if(_index <= 0)
        {
            return undefined;
        }else{
            const _front_v = this.getVehicle(_lane.getObjectIdByIndex(_index-1));
            return _front_v;
        }
    }
    
    vehicleGone(id:number,isLaneIn?:boolean){
        const _vehicle = this.getVehicle(id);
        this.roadSections[this.getRoadSectionIndex(_vehicle.getRoadSectionId())]
            .objGone(_vehicle.getLaneId(),_vehicle.getId(),isLaneIn);
        if(isLaneIn === false){
            this.vehicles.splice(this.getVehicleIndex(id),1);
        }
    }

    getVehicleIndex(id:number) {
        for(let i=0;i<this.vehicles.length;++i) {
            if(this.vehicles[i].getId() === id) {
                return i;
            }
        }
        return -1;
    }

    checkLeavingVehicle(){
        for(let i=0;i<this.vehicles.length;++i)
        {
            if(this.vehicles[i].getIsGone())
            {
                this.vehicleGone(this.vehicles[i].getId(),false);
                return true;
            }
        }
        return false;
    }

    checkTransitionVehicle(){
        for(let i=0;i<this.vehicles.length;++i)
        {
            if(this.vehicles[i].getIsInTransition()){
                if(this.vehicles[i].getAtPathSection() === 1){
                    var _section_id = this.vehicles[i].getRoadSectionId();
                    var _lane_id = this.vehicles[i].getLaneId();
                    const _head_link = this.getLane(_lane_id,_section_id).getHeadLink();

                    _section_id = _head_link[0].getSectionId();
                    _lane_id = _head_link[0].getLaneId();

                    this.vehicles[i].setRoadSectionId(_section_id);
                    this.vehicles[i].setLaneId(_lane_id);

                    this.vehicleGone(this.vehicles[i].getId());
                }
                if(this.vehicles[i].getAtPathSection() === 2){
                    this.roadSections[this.getRoadSectionIndex(this.vehicles[i].getRoadSectionId())]
                        .lane_out[this.vehicles[i].getLaneId()].addObjId(this.vehicles[i].getId());
                }
                this.vehicles[i].resetIsInTransition();
            }
        }
    }
}