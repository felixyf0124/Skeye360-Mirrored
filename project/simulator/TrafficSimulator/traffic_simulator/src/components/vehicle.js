import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
//import * as PIXI from "pixi.js";
import vehicle_img from '../images/vehicle.png';

export default class vehicle {
    constructor(app) {
      //super(props);
      this.img = vehicle_img;
      this.width = 80;
      this.height = 40;
      
    }
}