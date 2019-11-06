// import React, {Component} from 'react'
//pixi.js-legacy for VM
// import * as PIXI from "pixi.js-legacy";
import Object from "./Object";
import * as ts from '../TSGeometry';
import vec2 from "./vec2";

export default class vehicle extends Object{

    path:Array<Array<vec2>>;
    traveled:number;
    atPathSection:number;
    atPath:number;
    isGone:boolean;
    isInTransition:boolean;
    lastTime:number;
    maxSpeed:number;
    constructor(id:number, lane_id:number, roadSection_id:number, speed:number, position?:vec2) {
        super(id, lane_id, roadSection_id, speed, position);
        this.path = new Array<Array<vec2>>();
        this.traveled = 0;
        this.atPathSection = 0;
        this.atPath = 0;
        this.isGone = false;
        this.isInTransition = false;
        this.lastTime = Date.now();
        this.maxSpeed = speed;
    }

    //Getters
    checkFront(frontPostion:vec2, safetyDistance:number, targetSpeed?:number){
        let _distance = ts.tsLength(frontPostion.minus(this.position));
        var _speed = targetSpeed;
        if(_speed === undefined){
            _speed= 0;
        }
        if(_distance<safetyDistance)
        {
        this.updateSpeed(_speed);
        }else {
            this.updateSpeed();
        }
    }


    updateSpeed(targetSpeed?:number,acce?:number){
        var _acce = acce;
        var _targetSpeed = targetSpeed;
        if(_acce === undefined){
            _acce = 0.3 * this.maxSpeed;
        }
        if(_targetSpeed === undefined){
            _targetSpeed = this.maxSpeed;
        }

        if(this.speed<_targetSpeed){
            this.state = 1;
        }else if(this.speed>_targetSpeed){
            this.state = -1;
        }else{
            this.state = 0;
        }
        if(this.state === 1){
            this.speed += _acce;
            if(this.speed>_targetSpeed){
                this.speed = _targetSpeed;
                this.state = 0;
            }
        }
        if(this.state === -1){
            this.speed -= _acce;
            if(this.speed<_targetSpeed){
                this.speed = _targetSpeed;
                this.state = 0;
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