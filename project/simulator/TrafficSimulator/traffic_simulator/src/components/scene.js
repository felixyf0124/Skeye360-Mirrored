//learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
//import * as PIXI from "pixi.js";
import vehicle from '../images/vehicle.png';
import ppl from '../images/ppl.png';

export default class scene extends Component {
  constructor(props) {
    super(props);
    this.pixi_cnt = null;
    
    let _w = window.innerWidth;
    let _h = window.innerHeight;
    
    this.app = new PIXI.Application({width:_w,height:_h,resolution:window.devicePixelRatio});
    this.map = new PIXI.Container();
    this.objectCt = new PIXI.Container();
    this.app.stage.addChild(this.map)
    this.app.stage.addChild(this.objectCt);

    this.timeC=Date.now();
    this.fps = 0;
    //this.app = new PIXI.app.renderer({width:window.innerWidth,height:window.innerHeight});
  }

  

 initialize = () => {



    // const road = new PIXI.Graphics();
    // road.beginFill(0x575757);
    // road.drawRect(0,this.app.renderer.height/2-60,this.app.renderer.width,120);
    // const roadline = new PIXI.Graphics();
    // roadline.beginFill(0xffca57);
    // roadline.drawRect(0,this.app.renderer.height/2-2,this.app.renderer.width,4);
    // const roadline2 = new PIXI.Graphics();
    // roadline2.beginFill(0x575757);
    // roadline2.drawRect(this.app.renderer.width/2-60,this.app.renderer.height/2-2,120,4);
    
    // roadline2.beginFill(0xffffff);
    // roadline2.drawRect(this.app.renderer.width/2+60,this.app.renderer.height/2-60,8,62);
    // roadline2.drawRect(this.app.renderer.width/2-60,this.app.renderer.height/2+60,-8,-62);
    // roadline2.drawRect(this.app.renderer.width/2+40,this.app.renderer.height/2-60,4,120);
    // roadline2.drawRect(this.app.renderer.width/2-40,this.app.renderer.height/2-60,-4,120);
    
    
    
    // this.map.addChild(road);
    // this.map.addChild(roadline);
    
    // this.map.addChild(roadline2);
    // this.map.addChild(roadline2);

    this.drawRoad(2,2,0,this.map);

     this.vehicle = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);
     this.vehicle2 = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);

     this.ppl = new PIXI.Sprite(this.app.loader.resources["ppl"].texture);
     this.ppl2 = new PIXI.Sprite(this.app.loader.resources["ppl"].texture);

     this.objectCt.addChild(this.vehicle);
     this.objectCt.addChild(this.vehicle2);
     this.objectCt.addChild(this.ppl);
     this.objectCt.addChild(this.ppl2);
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
     
     this.ppl.anchor.x = 0.5;
     this.ppl.anchor.y = 0.5;
     this.ppl2.anchor.x = 0.5;
     this.ppl2.anchor.y = 0.5;

     this.app.ticker.add(this.animation);
 };

 setup = () => {
  this.app.loader
       .add("vehicle",vehicle)
       .add("ppl",ppl)
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

drawRoad=(laneNum1,laneNum2,degree,container) =>{
  const lane_w = 60;
  const line_w = 4;
  const road_w =(laneNum1+laneNum2)*lane_w;
  const road = new PIXI.Graphics();
  //draw road base
  road.beginFill(0x575757);
  
  road.drawRect(0,this.app.renderer.height/2-(road_w/2),this.app.renderer.width,road_w);
  
  //draw road lines
  if(laneNum1!==0&&laneNum2!==0)
  {
    road.beginFill(0xffca57);
    const midlinePos = (laneNum1 - (laneNum1+laneNum2)/2)*lane_w - line_w/2;
    road.drawRect(0,this.app.renderer.height/2+(midlinePos),this.app.renderer.width,line_w);
  }
  road.beginFill(0x575757);
  
  road.drawRect(this.app.renderer.width/2-60,this.app.renderer.height/2-2,120,4);
  
  road.beginFill(0xffffff);
  for(var i=1;i<(laneNum1+laneNum2);i++){
    if(i!==laneNum1){
    const linePos = (i - (laneNum1+laneNum2)/2)*lane_w - line_w/2;
    road.drawRect(0,this.app.renderer.height/2+(linePos),this.app.renderer.width,line_w);
    }
  }
  
  road.drawRect(this.app.renderer.width/2+60,this.app.renderer.height/2-60,8,62);
  road.drawRect(this.app.renderer.width/2-60,this.app.renderer.height/2+60,-8,-62);
  road.drawRect(this.app.renderer.width/2+40,this.app.renderer.height/2-60,4,120);
  road.drawRect(this.app.renderer.width/2-40,this.app.renderer.height/2-60,-4,120);
  
  
  container.addChild(road);
}

  animation = () =>{
    this.pos_x += 4;

    //sprite position
    this.vehicle.x = ((this.app.renderer.width/2 + this.pos_x-400)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    this.vehicle.y = (this.app.renderer.height/2 + this.pos_y+30);
    this.vehicle.rotation =PIXI.DEG_TO_RAD*180;
    this.vehicle2.x = ((this.app.renderer.width/2 -this.pos_x+400)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    
    this.vehicle2.y = (this.app.renderer.height/2 + this.pos_y-30)%this.app.renderer.height;
    this.vehicle2.rotation =PIXI.DEG_TO_RAD*0;


    this.ppl.x = ((this.app.renderer.width/2 -this.pos_y+30)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    this.ppl.y = ((this.app.renderer.height/2 + this.pos_x/2-100)%this.app.renderer.height+this.app.renderer.height)%this.app.renderer.height;
    this.ppl2.x = ((this.app.renderer.width/2 -this.pos_y-30)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    
    this.ppl2.y = ((this.app.renderer.height/2 - this.pos_x/2+100)%this.app.renderer.height+this.app.renderer.height)%this.app.renderer.height;

    let temp = Date.now() -this.timeC;
    this.fps++;
    if(temp>1000){
    
    console.log (temp+"/"+this.timeC.toString()+" / "+this.fps+"fps   from scene");
    this.timeC =Date.now();
    this.fps=0;
    }
  }
  
  render() {
    console.log("this works");
      return (
        <div ref={(element) => {this.updateCar(element)}} />
           
      );
  };
};