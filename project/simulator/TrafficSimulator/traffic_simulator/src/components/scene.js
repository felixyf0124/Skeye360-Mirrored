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

    this.trafficLight = new PIXI.Graphics();
    this.timeC=Date.now();
    this.trafficLightCounterOffset = 0;
    this.trafficLightCounter = Date.now();
    this.fps = 0;
    //this.app = new PIXI.app.renderer({width:window.innerWidth,height:window.innerHeight});
  }

  

 initialize = () => {

    window.addEventListener('resize',this.resize);
    
     this.vehicle = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);
     this.vehicle2 = new PIXI.Sprite(this.app.loader.resources["vehicle"].texture);

     this.ppl = new PIXI.Sprite(this.app.loader.resources["ppl"].texture);
     this.ppl2 = new PIXI.Sprite(this.app.loader.resources["ppl"].texture);

     this.drawRoad(2,3,2,2,this.map);

    //  this.objectCt.addChild(this.vehicle);
    //  this.objectCt.addChild(this.vehicle2);
    //  this.objectCt.addChild(this.ppl);
    //  this.objectCt.addChild(this.ppl2);
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

drawRoad=(laneDirLeft,laneDirRight,laneDirTop,laneDirDown,container) =>{
  const lane_w = 60;
  const line_w = 4;
  const zLine_w = 10;
  const road_w_h =(laneDirLeft+laneDirRight)*lane_w;
  const road_w_v =(laneDirTop+laneDirDown)*lane_w;
  const _w = this.app.renderer.width;
  const _h = this.app.renderer.height;
  const road = new PIXI.Graphics();
  //draw road base
  road.beginFill(0x575757);
  road.drawRect(0,_h/2-(road_w_h/2),_w,road_w_h);
  road.drawRect(_w/2-(road_w_v/2),0,road_w_v,_h);
  
  //draw side walk
  road.beginFill(0xcccccc);
  if(laneDirLeft+laneDirRight!==0)
  {
      road.drawRect(0, _h/2-(road_w_h/2), _w/2-road_w_v/2, -lane_w);
      road.drawRect(0, _h/2+(road_w_h/2), _w/2-road_w_v/2, lane_w);
      road.drawRect(_w, _h/2-(road_w_h/2), -(_w/2-road_w_v/2), -lane_w);
      road.drawRect(_w, _h/2+(road_w_h/2), -(_w/2-road_w_v/2), lane_w);
  }
  if(laneDirTop+laneDirDown!==0)
  {
  road.drawRect(_w/2-road_w_v/2, 0, -lane_w, _h/2-road_w_h/2);
  road.drawRect(_w/2+road_w_v/2, 0, lane_w, _h/2-road_w_h/2);
  road.drawRect(_w/2-road_w_v/2, _h, -lane_w, -(_h/2-road_w_h/2));
  road.drawRect(_w/2+road_w_v/2, _h, lane_w, -(_h/2-road_w_h/2));
  }
  
  //draw road lines
  //yellow line
  road.beginFill(0xffca57);
  if(laneDirLeft!==0&&laneDirRight!==0)
  {
    const midlinePos_h = (laneDirLeft - (laneDirLeft+laneDirRight)/2)*lane_w - line_w/2;
    var lineLength; 
    if(laneDirTop+laneDirDown!==0){
        lineLength = _w/2-road_w_v/2-lane_w*1.2;
    }else{
        lineLength = _w/2-road_w_v/2-lane_w*0.7;
    }
    road.drawRect(0,_h/2+(midlinePos_h),lineLength,line_w);
    road.drawRect(_w,_h/2+(midlinePos_h),-(lineLength),line_w);
  }
  if(laneDirTop!==0&&laneDirDown!==0)
  {
    const midlinePos_v = -(laneDirTop - (laneDirTop+laneDirDown)/2)*lane_w - line_w/2;
    var lineLength; 
    if(laneDirLeft+laneDirRight!==0){
        lineLength = _h/2-road_w_h/2-lane_w*1.2;
    }else{
        lineLength = _h/2-road_w_h/2-lane_w*0.7;
    }
    road.drawRect(_w/2+(midlinePos_v),0,line_w,lineLength);
    road.drawRect(_w/2+(midlinePos_v),_h,line_w,-(lineLength));
  }
  
  //white line
  road.beginFill(0xffffff);
  for(var i=1;i<(laneDirLeft+laneDirRight);i++){
    if(i!==laneDirLeft){
        const linePos = (i - (laneDirLeft+laneDirRight)/2)*lane_w ;
        
        var lineLength;
        if(laneDirTop+laneDirDown!==0)
        {
            lineLength = _w/2-road_w_v/2-lane_w*1.2;
        }else{
            lineLength = _w/2-road_w_v/2-lane_w*0.7;
        }
        this.drawDashLine(road,[0,_h/2+linePos],[(lineLength),_h/2+linePos],0.6,lineLength/lane_w,this.map,line_w,0xffffff);
        
        this.drawDashLine(road,[_w,_h/2+linePos],[(_w-lineLength),_h/2+linePos],0.6,lineLength/lane_w,this.map,line_w,0xffffff);
        road.lineStyle(0,0xffffff);
        if(i<laneDirLeft)
        {
            road.drawRect(_w-lineLength,_h/2+(linePos - line_w/2),lane_w*2,line_w);
        }else{
            road.drawRect(lineLength,_h/2+(linePos - line_w/2),-lane_w*2,line_w);
        }
    }
  }

  for(var i=1;i<(laneDirTop+laneDirDown);i++){
    if(i!==laneDirTop){
        const linePos = -(i - (laneDirTop+laneDirDown)/2)*lane_w;
        
        var lineLength;
        if(laneDirLeft+laneDirRight!==0)
        {
            lineLength = _h/2-road_w_h/2-lane_w*1.2;
        }else{
            lineLength = _h/2-road_w_h/2-lane_w*0.7;
        }
        this.drawDashLine(road,[_w/2+(linePos),0],[_w/2+(linePos),lineLength],0.6,lineLength/lane_w,this.map,line_w,0xffffff);
        
        this.drawDashLine(road,[_w/2+(linePos),_h],[_w/2+(linePos),_h-lineLength],0.6,lineLength/lane_w,this.map,line_w,0xffffff);
        road.lineStyle(0,0xffffff);
        if(i<laneDirTop)
        {
            road.drawRect(_w/2+(linePos - line_w/2),_h-lineLength,line_w,lane_w*2);
        }else{
            road.drawRect(_w/2+(linePos - line_w/2),lineLength,line_w,-lane_w*2);
        }
    }
  }
  if(laneDirLeft!==0)
  {
    const linePos_y = (laneDirLeft - (laneDirLeft+laneDirRight)/2)*lane_w;
    var linePos_x;
    if(laneDirTop+laneDirDown!==0)
    {
        linePos_x = _w/2+road_w_v/2+lane_w*1.2;
    }else{
        linePos_x = _w/2+road_w_v/2+lane_w*0.7;
    }
    road.drawRect(linePos_x,_h/2+(linePos_y),8,-lane_w*laneDirLeft+line_w/2);
  }
  if(laneDirRight!==0)
  {
    const linePos_y = (laneDirLeft - (laneDirLeft+laneDirRight)/2)*lane_w ;
    var linePos_x;
    if(laneDirTop+laneDirDown!==0)
    {
        linePos_x = _w/2-road_w_v/2-lane_w*1.2;
    }else{
        linePos_x = _w/2-road_w_v/2-lane_w*0.7;
    }
    road.drawRect(linePos_x, _h/2+(linePos_y),-8,lane_w*laneDirRight-line_w/2);
  }
  if(laneDirTop!==0)
  {
    const linePos_x = (laneDirTop - (laneDirTop+laneDirDown)/2)*lane_w;
    var linePos_y;
    if(laneDirLeft+laneDirRight!==0)
    {
        linePos_y = _h/2+road_w_h/2+lane_w*1.2;
    }else{
        linePos_y = _h/2+road_w_h/2+lane_w*0.7;
    }
    road.drawRect(_w/2-(linePos_x), linePos_y,lane_w*laneDirTop-line_w/2,8);
  }
  if(laneDirDown!==0)
  {
    const linePos_x = (laneDirTop - (laneDirTop+laneDirDown)/2)*lane_w;
    var linePos_y;
    if(laneDirLeft+laneDirRight!==0)
    {
        linePos_y = _h/2-road_w_h/2-lane_w*1.2;
    }else{
        linePos_y = _h/2-road_w_h/2-lane_w*0.7;
    }
    road.drawRect(_w/2-(linePos_x), linePos_y,-lane_w*laneDirDown+line_w/2,-8);
  }
  
  //zebra crossing
  road.lineStyle(zLine_w,0xffffff);
  var zOffset_x,zOffset_y;
  if(laneDirTop+laneDirDown!==0)
    {
        zOffset_x = lane_w;
    }else{
        zOffset_x = lane_w/2;
    }
    if(laneDirLeft+laneDirRight!==0)
    {
        zOffset_y = lane_w;
    }else{
        zOffset_y = lane_w/2;
    }
  const tempPos_nwDir = [_w/2-lane_w*(laneDirTop+laneDirDown)/2, _h/2-lane_w*(laneDirLeft+laneDirRight)/2];
  //west
  for(i=1; i<(lane_w/zLine_w)*(laneDirLeft+laneDirRight)/2;i++)
  {
      road.moveTo(tempPos_nwDir[0],       tempPos_nwDir[1]+i*zLine_w*2);
      road.lineTo(tempPos_nwDir[0]-zOffset_x,tempPos_nwDir[1]+i*zLine_w*2);
  }
  //north
  for(i=1; i<(lane_w/zLine_w)*(laneDirTop+laneDirDown)/2;i++)
  {
      road.moveTo(tempPos_nwDir[0]+i*zLine_w*2,tempPos_nwDir[1]);
      road.lineTo(tempPos_nwDir[0]+i*zLine_w*2,tempPos_nwDir[1]-zOffset_y);
  }

  const tempPos_seDir = [_w/2+lane_w*(laneDirTop+laneDirDown)/2, _h/2+lane_w*(laneDirLeft+laneDirRight)/2];
  //east
  for(i=1; i<(lane_w/zLine_w)*(laneDirLeft+laneDirRight)/2;i++)
  {
      road.moveTo(tempPos_seDir[0],       tempPos_seDir[1]-i*zLine_w*2);
      road.lineTo(tempPos_seDir[0]+zOffset_x,tempPos_seDir[1]-i*zLine_w*2);
  }
  //south
  for(i=1; i<(lane_w/zLine_w)*(laneDirTop+laneDirDown)/2;i++)
  {
      road.moveTo(tempPos_seDir[0]-i*zLine_w*2,tempPos_seDir[1]);
      road.lineTo(tempPos_seDir[0]-i*zLine_w*2,tempPos_seDir[1]+zOffset_y);
  }
  
  container.addChild(road);
}

drawDashLine=(dashLine,startPos,endPos,dashLengthRatio,dashNum,container,width,color)=>{
    
    dashLine.lineStyle(width,color);
    const unitLength = [(endPos[0]-startPos[0])/dashNum,(endPos[1]-startPos[1])/dashNum];

    for(var i =-1; i<dashNum-1;i++){
        const tempPos = [startPos[0]+unitLength[0]*i+unitLength[0]*(1-dashLengthRatio),startPos[1]+unitLength[1]*i+unitLength[1]*(1-dashLengthRatio)];
        //if(tempPos[0]+unitLength[0]*dashLengthRatio<=endPos[0]&&tempPos[1]+unitLength[1]*dashLengthRatio<=endPos[1])
        dashLine.moveTo(tempPos[0],tempPos[1]);
        dashLine.lineTo(tempPos[0]+unitLength[0]*dashLengthRatio,tempPos[1]+unitLength[1]*dashLengthRatio);
    }
    //container.addChild(dashLine);
}

drawTrafficLight=(laneDirLeft,laneDirRight,laneDirTop,laneDirDown,container,initGreenDirV, gTime,yTime,gTime2,yTime2)=>{
  const lane_w = 60;
  const _r = 6;
  const _w = this.app.renderer.width;
  const _h = this.app.renderer.height;
  const road_w_h =(laneDirLeft+laneDirRight)*lane_w;
  const road_w_v =(laneDirTop+laneDirDown)*lane_w;
  var tempCounter;
  if(initGreenDirV)
  {
    tempCounter = Date.now()-(this.trafficLightCounter+this.trafficLightCounterOffset);
  }else{
    tempCounter = Date.now()+(gTime+yTime)-(this.trafficLightCounter+this.trafficLightCounterOffset);
  }

  //clear
  this.trafficLight.clear();

  //draw hori direction
  if(tempCounter%((gTime+yTime+gTime2+yTime2)*1000)<gTime*1000)
  {
    this.trafficLight.beginFill(0x00ff00);
  }else if (tempCounter%((gTime+yTime+gTime2+yTime2)*1000)<(gTime+yTime)*1000)
  {
    this.trafficLight.beginFill(0xffbb00);
  }else{
    this.trafficLight.beginFill(0xff0000);
  }
  this.trafficLight.drawCircle(_w/2 - (road_w_v/2 + lane_w),_h/2 - (road_w_h/2+lane_w/4),_r);
  this.trafficLight.drawCircle(_w/2 + (road_w_v/2 + lane_w),_h/2 + (road_w_h/2+lane_w/4),_r); 
  

  if(tempCounter%((gTime+yTime+gTime2+yTime2)*1000)<(gTime+yTime)*1000)
  {
    this.trafficLight.beginFill(0xff0000);
  }else if (tempCounter%((gTime+yTime+gTime2+yTime2)*1000)<(gTime+yTime+gTime2)*1000)
  {
    this.trafficLight.beginFill(0x00ff00);
  }else{
    this.trafficLight.beginFill(0xffbb00);
  }
  this.trafficLight.drawCircle(_w/2 - (road_w_v/2 + lane_w), _h/2 + (road_w_h/2+lane_w/4),_r);
  this.trafficLight.drawCircle(_w/2 + (road_w_v/2 + lane_w), _h/2 - (road_w_h/2+lane_w/4),_r); 
  container.addChild(this.trafficLight);

}

  animation = () =>{
      
    this.drawTrafficLight(3,2,3,2,this.map,true,10,5,10,5);
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