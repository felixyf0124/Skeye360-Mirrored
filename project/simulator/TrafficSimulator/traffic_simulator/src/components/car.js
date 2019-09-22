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
    
    let _w = window.innerWidth;
    let _h = window.innerHeight;
    
    this.app = new PIXI.Application({width:_w,height:_h,resolution:window.devicePixelRatio});
    
    this.timeC=Date.now();
    this.fps = 0;
    //this.app = new PIXI.app.renderer({width:window.innerWidth,height:window.innerHeight});
  }

  

 initialize = () => {

     this.vehicle = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);
     this.vehicle2 = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);
     window.addEventListener('resize',this.resize);
     
    this.pos_x =0; 
    this.pos_y=0;
     //sprite position
     this.vehicle.x = this.app.renderer.width/2 + this.pos_x;
     this.vehicle.y = this.app.renderer.height/2 + this.pos_y;

     
     this.vehicle2.x = this.app.renderer.width/2 + this.pos_x;
     this.vehicle2.y = this.app.renderer.height/2 + this.pos_y;
     //sprite center point
     this.vehicle.anchor.x = 0.5;
     this.vehicle.anchor.y = 0.5;
     this.vehicle2.anchor.x = 0.5;
     this.vehicle2.anchor.y = 0.5;

     this.app.stage.addChild(this.vehicle);
     this.app.stage.addChild(this.vehicle2);
     this.app.ticker.add(this.animation);
 };

 setup = () => {
  this.app.loader
       .add("vehicle",vehicle)
       .load(this.initialize);
};

resize = () =>{
  let _w = window.innerWidth;
  let _h = window.innerHeight;
  this.app.renderer.resize(_w,_h);
 }
  updateCar= (element) => {
      
      this.pixi_cnt = element;
      if(this.pixi_cnt && this.pixi_cnt.children.length<=0) {
        this.pixi_cnt.appendChild(this.app.view);
        this.setup();
      }
  };

  animation = () =>{
    this.pos_x += 1.1;

    //sprite position
    this.vehicle.x = ((this.app.renderer.width/2 + this.pos_x-400)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    this.vehicle.y = (this.app.renderer.height/2 + this.pos_y);
    this.vehicle.rotation =PIXI.DEG_TO_RAD*180;
    this.vehicle2.x = ((this.app.renderer.width/2 -this.pos_x+400)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    
    this.vehicle2.y = (this.app.renderer.height/2 + this.pos_y-100)%this.app.renderer.height;
    this.vehicle2.rotation =PIXI.DEG_TO_RAD*0;
    let temp = Date.now() -this.timeC;
    this.fps++;
    if(temp>1000){
    
    console.log (temp+"/"+this.timeC.toString()+" / "+this.fps+"fps");
    this.timeC =Date.now();
    this.fps=0;
    }
  }
  
  render() {
    console.log("this works");
      return <div ref={(element) => {this.updateCar(element)}} />;
  };
};