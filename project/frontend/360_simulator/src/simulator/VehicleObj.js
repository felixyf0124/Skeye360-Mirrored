import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
import Object from "./Object";

export default class vehicle extends Object{
  _graphic_obj;
    length;
    width;
    constructor(position,positionOffset, directionDeg, directionDegOffset, length, width) {
      super(position,positionOffset, directionDeg, directionDegOffset, length, width);
      this.length = length;
      this.width = width;

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