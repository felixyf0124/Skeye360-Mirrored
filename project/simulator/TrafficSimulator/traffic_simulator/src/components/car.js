//learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
//import * as PIXI from "pixi.js";
import vehicle from '../images/vehicle.png';


export default class car extends Component {
  constructor(props) {
    super(props);
    this.pixi_cnt = null;
    this.app = new PIXI.Application({width:600,height:600});
  }

  

 initialize = () => {
     this.vehicle = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);
     this.app.stage.addChild(this.vehicle);
 
 };

 setup = () => {
  this.app.loader
       .add("vehicle",vehicle)
       .load(this.initialize);
};

  updateCar= (element) => {
      
      this.pixi_cnt = element;
      if(this.pixi_cnt && this.pixi_cnt.children.length<=0) {
        this.pixi_cnt.appendChild(this.app.view);
        this.setup();
      }
  };
  
  render() {
    console.log("this works");
      return <div ref={(element) => {this.updateCar(element)}} />;
  };
};