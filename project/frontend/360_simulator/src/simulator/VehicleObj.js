import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
import Object from "./Object";

export default class vehicle extends Object{
   
    length;
    width;
    constructor(position,positionOffset, directionDeg, directionDegOffset, length, width) {
      super(position,positionOffset, directionDeg, directionDegOffset, length, width);
      this.length = length;
      this.width = width;

    }

    // render(position){
    //     this.setPosition(position);
    //     return this.render();
    // }

    render()
    {
        const _graphic_obj = new PIXI.Graphics();

        const _vehicle_body = [
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
        ]


        _graphic_obj.beginFill(0x0ff5f5);
        _graphic_obj.drawPolygon(_vehicle_body);
        _graphic_obj.drawRect(100, 100, 200, 50);
        //_graphic_obj.endFill();
        _graphic_obj.x = this.position.x + this.positionOffset.x;
        _graphic_obj.x = this.position.y + this.positionOffset.y;
      console.log(_graphic_obj);

        return _graphic_obj;
    }
    
    
}