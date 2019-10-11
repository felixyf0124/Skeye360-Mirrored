import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
import Object from "./Object";
import * as ts from './TSGeometry';

export default class vehicle extends Object{
  //_graphic_obj;
    length;
    width;
    fromDir;
    toDir;
    speed;
    velocityOffset = ts.tsVec2(0,0);
    constructor(position,positionOffset, directionDeg, directionDegOffset, length, width) {
      super(position,positionOffset, directionDeg, directionDegOffset, length, width);
      this.length = length;
      this.width = width;

    }
    

    setStopLine(stop_line){
      this.stop_line = stop_line;
    }


    updateTranslate(traffic_light_state_obj){
      if(traffic_light_state_obj.light ===1 )
      {
        this.resetVelocityOffset();
        this.updatePos();
      console.log("count 1 | x =" +this.position.x);

      }else if(traffic_light_state_obj.light ===2)
      {
      console.log("count 2 | x =" +this.position.x);

        const _distance = this.getDistanceToStopLine();
        if(_distance >4 && _distance <0)
        {
        this.resetVelocityOffset();

          this.updatePos();

        }else{
            this.slowDown(0.05);
            this.updatePos();

        }
        
      }else{
      console.log("count 3 | x =" +this.position.x);

        const _distance = this.getDistanceToStopLine();

        if(_distance >4 && _distance <0)
        {
        this.resetVelocityOffset();

          this.updatePos();

        }else{
            this.slowDown(0.05);
            this.updatePos();

        }
      }
  }
  updatePos(){
    this.position.x = this.position.x + this.velocity.x + this.velocityOffset.x;
  }
  getDistanceToStopLine()
  {
    const    _position = this.getPosition();
    const _dot_product = ts.tsDotVec2(_position,this.stop_line);
    const _displace = ts.tsVec2(_position.x-this.stop_line.x, _position.y-this.stop_line.y);
    const _distance = ts.tsLength(_displace);
    if(_dot_product<0){
      return -_distance;
    } else{
      return _distance;
    }
  }
  
  slowDown(fraction_a)
  {
    if(ts.tsLength(this.velocityOffset)<ts.tsLength(this.velocity)-2)
    {
      this.velocityOffset = ts.tsVec2(
        this.velocityOffset.x - this.velocity.x*fraction_a,
        this.velocityOffset.y - this.velocity.y*fraction_a);
    }else{
      this.velocityOffset = ts.tsVec2(-this.velocity.x,-this.velocity.y);
    }
  }
  resetVelocityOffset(){
    this.velocityOffset = ts.tsVec2(0,0);
  }

     render ()
    {

        const vehicleBody = [
         this.length/2.0,this.width/2.0*0.8,
            this.length/2.0*0.9,this.width/2.0*0.9,
            this.length/2.0*0.8,this.width/2.0,
            -this.length/2.0*0.8,this.width/2.0,
            -this.length/2.0,this.width/2.0*0.9,
            -this.length/2.0,-this.width/2.0*0.9,
            -this.length/2.0*0.8,-this.width/2.0,
            this.length/2.0*0.8,-this.width/2.0,
            this.length/2.0*0.9,-this.width/2.0*0.9,
            this.length/2.0,-this.width/2.0*0.8
            ,
            this.length/2.0,this.width/2.0*0.8
        ];


        return vehicleBody;
    }
    
    
}