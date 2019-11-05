// import React, {Component} from 'react'
// pixi.js-legacy for VM
// import * as PIXI from "pixi.js-legacy";
import Object from './Object';
import * as ts from '../TSGeometry';
import Lane from "./Lane";
import vec2 from "./vec2";


export default class vehicle extends Object {
    id: number;

    path:Array<vec2>;
    traveled:number;
    atPath:number;
    isGone:boolean;
    lastTime:number;
    constructor(id:number, lane_id:number, roadSection_id:number, speed:number, position?:vec2) {
        super(id, lane_id, roadSection_id, speed, position);
        this.path = new Array<vec2>();
        this.traveled = 0;
        this.atPath = 0;
        this.isGone = false;
        this.lastTime = Date.now();
    }

    //Getters
    checkFront(traveled:number, safetyDistance:number, speed?:number, acce?:number){
        let _distance = traveled - this.traveled;
        var _speed = speed||0;
        // var _speed_dif = this.speed - _speed;
        var _acce = acce||1;
        // var _stop_t = _speed/_acce;
        // var _stop_dis = safetyDistance + (_speed/_acce)

        if(_distance<safetyDistance)
        {
            // let _space = safetyDistance -_distance;
            if(this.speed > _speed)
            {
                this.speed -= 1*_acce;
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

    getTraveled(){
        return this.traveled;
    }
    getIsGone(){
        return this.isGone;
    }

    updatePosition(disToTravel:number){
        const _unit_vec = ts.tsNormalize(this.path[this.atPath+1].minus(this.position));
        const _length_of_current_path = this.getPathLength(this.atPath+1);
        if(this.traveled + disToTravel<_length_of_current_path)
        {
            this.position = this.position.plus(_unit_vec.multiply(disToTravel));
        }else{
            this.position = this.path[this.atPath+1];
            if(this.atPath === this.path.length-1)
            {
                this.isGone = true;
            }else
            {
                const _dis_to_travel = this.traveled + disToTravel - _length_of_current_path;
                this.updatePosition(_dis_to_travel);
            }
        }
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
    getPathLength(index?:number){
        var _length = 0;
        var _index = index||this.path.length-1
        for(let i=0;i<_index;++i)
        {
             _length += ts.tsLength(this.path[i+1].minus(this.path[i]));
        }
        return _length;

    }
}
