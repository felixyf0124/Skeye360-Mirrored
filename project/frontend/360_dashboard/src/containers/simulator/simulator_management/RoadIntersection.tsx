import { number } from 'prop-types';
import RoadSection from './RoadSection';
import vec2 from './vec2';
import TLManager from './TrafficLightManager';
import * as ts from '../TSGeometry';
import Lane from './Lane';
import LanePointer from './LanePointer';

import TrafficLightManager from './TrafficLightManager';
import { number } from 'prop-types';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';


/**
 * @class RoadIntersection
 */
export default class RoadIntersection {
    id: number;

    // mapCoordinate:{x:number,y:number};
    mapCoordinate: vec2;
    roadSections:Array<RoadSection>;
    TLManager:TLManager;
    laneWidth:number;
    vehicles:Array<Vehicle>;

    constructor(id:number, mapCoordinate:vec2, TLManager?: TrafficLightManager)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = TLManager||new TrafficLightManager(id);
        this.laneWidth =0;
        this.vehicles = new Array<Vehicle>();

    }

    // Getters
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
    setLaneWidth(width:number) {
        this.laneWidth = width;

    }

    addNewTrafficLight(laneGroup:Array<{section:number,id:number}>,time:number,specifiedYellowTime?:number){
        this.TLManager.addTrafficLight(laneGroup,time,specifiedYellowTime);
        // console.log(this.TLManager.getTrafficLightQueue());
        //add TL id to lanes
        
        this.bindTrafficLight(this.TLManager.getTrafficLightQueue()[this.TLManager.getTrafficLightQueue().length-1]);
    }

    addNewVehicle(lane_id:number,section_id:number,speed:number,vehicle_id?:number,position?:vec2) {
        const _obj_v = new Vehicle(vehicle_id||Date.now(),lane_id,section_id,speed,position);
        
        this.roadSections[this.getRoadSectionIndex(_obj_v.getRoadSectionId())].lane_in[_obj_v.getLaneId()].addObjId(_obj_v.getId());
        const _lane_from = this.getLane(lane_id,section_id);
        console.log(_lane_from);
        const _lane_pointer = _lane_from.getHeadLink();
        const _lane_to = this.getLane(_lane_pointer[0].getLaneId(),_lane_pointer[0].getSectionId(),false);
        //safety dis
        const _safety_dis = 25;

        _obj_v.path.push(_lane_from.getTail());
        _obj_v.path.push(_lane_from.getHead());
        _obj_v.path.push(_lane_to.getTail());
        _obj_v.path.push(_lane_to.getHead());

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
            // _obj_v.setPosition(_front_pos);

        } else {
            _obj_v.setPosition(_lane_from.getTail());
        }
        this.vehicles.push(_obj_v);
        
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

        for(let i=0;i<this.roadSections.length;++i) {
            this.roadSections[i].updateLanePosition(this.laneWidth);
        }

        var _intersections = new Array<Array<vec2>>();
        for(let i = 0; i < this.roadSections.length; ++i) {
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
        //TO DO 
        //solve the bug and add improved auto offset update funtion

            //temp solution

        const _direct = ts.tsNormalize(this.roadSections[i].getTail().minus(this.roadSections[i].getHead()));
        this.roadSections[i].offsetLanes(_direct.multiply(3 * this.laneWidth));
      }
      return _intersections;
    }

    // updateLaneState() {
    //     let _trafficLightQueue = this.TLManager.getTrafficLightQueue();
    //     for (let i = 0; i < _trafficLightQueue.length; ++i)
    //     {
    //         let _boundLanes = _trafficLightQueue[i].getBoundLanes();
    //         for(let j = 0; j < _boundLanes.length; ++j)
    //         {
    //             let _section_index = this.getRoadSectionIndex(_boundLanes[j].section);
    //             this.resortRoadSections[_section_index].
    //         }
    //     }
    // }

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

        for(let i=0; i< _resort.length-1; ++i) {
            var _min = _resort[i];
            for(let j=_resort.length-1; j>i; --j) {
                if(_min.angle>_resort[j].angle) {
                    _min = _resort[j];
                    _resort[j] = _resort[i];
                    _resort[i] = _min;
                }
            }
            
        }
        console.log(_resort);
        var _roadSections = new Array<RoadSection>();

        for(let i = 0; i < _resort.length; ++i) {
            _roadSections.push(this.roadSections[_resort[i].index]);

        }
      }
      console.log(_resort);
      const _roadSections = new Array<RoadSection>();

      for (let i = 0; i < _resort.length; ++i) {
        _roadSections.push(this.roadSections[_resort[i].index]);
      }

      this.roadSections = _roadSections;
    }

    resortTrafficLightQueue() {
        let _resort = new Array<number>();
        for(let i = 0; i < this.roadSections.length; ++i) {
            for(let j = 0; j < this.roadSections[i].lane_in.length; ++j) {
        // console.log(_resort[0]);

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
      const _roadSection = new RoadSection(this.roadSections.length, this.id, tailVec2);
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
       // console.log(this.TLManager.getDeltaT());
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
            const _front_v = this.getFrontVehicle(_id);
            if(_front_v !== null) {
                this.vehicles[i].checkFront(_front_v.getTraveled(),25,_front_v.getSpeed());
            }
            this.vehicles[i].updatePosition(this.vehicles[i].getSpeed()*this.vehicles[i].getDeltaT());
        }
        while(this.checkLeavingVehicle());
    }

    getFrontVehicle(id:number) {
        const _vehicle = this.getVehicle(id)

        const _lane = this.getLane(_vehicle.getLaneId(),_vehicle.getRoadSectionId())
        const _index = _lane.getObjIndex(id);
        if(_index === 0) {
            return null;
        } else {
            const _front_v = this.getVehicle(_lane.getObjIndex(_index-1));
            return _front_v;
        }
    }
    
    vehicleGone(id:number) {
        const _vehicle = this.getVehicle(id);
        this.roadSections[this.getRoadSectionIndex(_vehicle.getRoadSectionId())]
            .objGone(_vehicle.getLaneId(),_vehicle.getId());
        this.vehicles.splice(this.getVehicleIndex(id),1);
    }

    getVehicleIndex(id:number) {
        for(let i=0;i<this.vehicles.length;++i) {
            if(this.vehicles[i].getId() === id) {
                return i;
            }
        }
        return -1;
    }

    checkLeavingVehicle() {
        for(let i=0;i<this.vehicles.length;++i) {
            if(this.vehicles[i].getIsGone()) {
                this.vehicleGone(this.vehicles[i].getId());
                return true;
            }
        }
        return false;
    }
}

