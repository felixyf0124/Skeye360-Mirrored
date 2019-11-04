// import React, {Component} from 'react'
//pixi.js-legacy for VM
// import * as PIXI from "pixi.js-legacy";
import Object from "./Object";
import * as ts from '../TSGeometry';
import Lane from "./Lane";
import vec2 from "./vec2";

export default class vehicle extends Object{

    path:Array<Array<vec2>>;
    traveled:number;
    atPathSection:number;
    atPath:number;
    isGone:boolean;
    isInTransition:boolean;
    lastTime:number;
    constructor(id:number, lane_id:number, roadSection_id:number, speed:number, position?:vec2) {
        super(id, lane_id, roadSection_id, speed, position);
        this.path = new Array<Array<vec2>>();
        this.traveled = 0;
        this.atPathSection = 0;
        this.atPath = 0;
        this.isGone = false;
        this.isInTransition = false;
        this.lastTime = Date.now();
    }

    //Getters
    checkFront(traveled:number, safetyDistance:number, speed?:number, acce?:number){
        let _distance = traveled - this.traveled;
        var _speed = speed||0;
        var _speed_dif = this.speed - _speed;
        var _acce = acce||0.3;
        // var _stop_t = _speed/_acce;
        // var _stop_dis = safetyDistance + (_speed/_acce)

        if(_distance<safetyDistance)
        {
            // let _space = safetyDistance -_distance;
            if(this.speed > _speed)
            {
                this.speed -= 1*_acce * _speed_dif;
                if(this.speed < 0)
                {
                    this.speed = 0;
                }
            }
        }else{
            if(this.speed < _speed)
            {
                this.speed += _acce;
            }else{
                this.speed = _speed;
            }
        }
    
    }

    getPath(){
        return this.path;
    }

    getAtPath(){
        return this.atPath;
    }
    getAtPathSection(){
        return this.atPathSection;
    }

    getTraveled(){
        return this.traveled;
    }
    getIsGone(){
        return this.isGone;
    }

    getIsInTransition(){
        return this.isInTransition;
    }

    resetIsInTransition(){
        this.isInTransition = false;
    }

    updatePosition(disToTravel:number){
        const _unit_vec = ts.tsNormalize(this.path[this.atPathSection][this.atPath+1].minus(this.position));
        const _length_of_current_path = this.getPathLength(this.atPathSection,this.atPath+1);
        if(this.atPathSection === 0){
            const _dis_to_travel_of_current_path = ts.tsLength(this.position.minus(
                this.path[this.atPathSection][this.atPath+1]
            ));
            if(_dis_to_travel_of_current_path>_length_of_current_path){
                this.traveled = _length_of_current_path - _dis_to_travel_of_current_path;
            }
            
        }
        // console.log('_length_of_current_path '+ _length_of_current_path);
        // console.log('traveled '+ (this.traveled + disToTravel));
        if(this.traveled + disToTravel<_length_of_current_path)
        {
            this.position = this.position.plus(_unit_vec.multiply(disToTravel));
            this.traveled += disToTravel;
        }else{
            this.position = this.path[this.atPathSection][this.atPath+1];
            this.atPath += 1;
            const _dis_to_travel = this.traveled + disToTravel - _length_of_current_path;
            this.traveled = _length_of_current_path;
            if(this.atPath === this.path[this.atPathSection].length-1)
            {
                // console.log('atPSec' + this.atPathSection + "|" + this.path.length);
                if(this.atPathSection + 1 === this.path.length ){
                    this.isGone = true;
                }else{
                    ++this.atPathSection;
                    this.atPath = 0;
                    this.traveled = 0;
                    this.isInTransition = true;
                    this.updatePosition(_dis_to_travel);
                }
            }else
            {
                this.updatePosition(_dis_to_travel);
            }
        }
        // console.log('id: '+ this.id + " | " + this.position.x + " | " + this.position.y);

    }

    getDeltaT(){
        const _currentTime = Date.now();
        const _deltaT = _currentTime - this.lastTime;
        this.lastTime = _currentTime;
        return _deltaT;
    }

    /**
     * till which index
     * @param index 
     */
    getPathLength(pathSection:number,pathIndex?:number){
        var _length = 0;
        var _index = pathIndex||this.path[pathSection].length-1
        for(let i=0;i<_index;++i)
        {
             _length += ts.tsLength(this.path[pathSection][i+1].minus(this.path[pathSection][i]));
        }
        return _length;
    }
}