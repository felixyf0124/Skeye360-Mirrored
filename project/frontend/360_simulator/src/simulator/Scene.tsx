//learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React, {Component} from 'react';
import { connect } from 'react-redux';
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
import { RootState } from '../reducers/rootReducer';
import { Store } from 'redux';
import vehicle from '../images/vehicle.png';
import ppl from '../images/ppl.png';
import TrafficLight from './TrafficLight.js';
import { Root } from 'react-dom';
import VehicleObj from './VehicleObj';
// interface Props {
  
//   roadStructureData: Array<number>;
//   trafficLightCountDown: Array<number>;
//   laneWidth: number;
//   numOfHorizontalRoad: number;
//   numOfVerticalRoad: number;
// }

/**
 * @class Scene
 * @extends {Component}
 */
class Scene extends Component {
  // class Scene extends Component<Props> {
  pixiContent: any;
  window_w:number;
  window_h:number;
  app: PIXI.Application;
  mapContainer: PIXI.Container;
  objectContainer: PIXI.Container;
  displayPlaneContainer: PIXI.Container;
  backGround_G: PIXI.Graphics;
  road_G: PIXI.Graphics;
  trafficLight_G: PIXI.Graphics;
  trafficLightManager: TrafficLight;

// the following should be moved outside when enable to connect with db
  roadData: Array<number>
  trafficLightData: Array<Array<number>>
  lane_w:number;
  road_w_h:number;
  road_w_v:number;

  trafficLightCounterOffset:number;
  trafficLightCounter:number;
  
  timeLastMoment:number;

  fps:number;
  textStyle: any;
  
  // vehicleTexture:PIXI.Texture;
  // pedestrianTexture:PIXI.Texture;
  // vehicle:PIXI.Sprite;
  // vehicle2:PIXI.Sprite;
  // car:VehicleObj;
  // ppl:PIXI.Sprite;
  // ppl2:PIXI.Sprite;
  vehicle:any;
  vehicle2:PIXI.Graphics;
  car:VehicleObj;
  ppl:PIXI.Graphics;
  ppl2:PIXI.Graphics;
  pos_x:number;
  pos_y:number;

  constructor(props: any) {
    super(props);
    this.pixiContent = null;
    this.window_w = window.innerWidth;
    this.window_h = window.innerHeight;
    this.app = new PIXI.Application({width:this.window_w,height:this.window_w,resolution:window.devicePixelRatio});
    this.mapContainer = new PIXI.Container();
    this.objectContainer = new PIXI.Container();
    this.displayPlaneContainer = new PIXI.Container();
    this.app.stage.addChild(this.mapContainer);
    this.app.stage.addChild(this.objectContainer);
    this.app.stage.addChild(this.displayPlaneContainer);
    this.backGround_G = new PIXI.Graphics();
    this.road_G = new PIXI.Graphics();
    this.trafficLight_G = new PIXI.Graphics();
    this.mapContainer.addChild(this.backGround_G);
    this.mapContainer.addChild(this.road_G);
    this.mapContainer.addChild(this.trafficLight_G);
    // [this.window_w/2,this.window_h/2]
    this.car = new VehicleObj([0.0,0.0],[0,0],0,0,80,40);
    // let _car =this.car.render();
    // _car.beginFill(0x0ff5f5);
    // _car.drawRect(100, 100, 200, 50);
    // this.mapContainer.addChild(_car);
      console.log(this.car);
    //   console.log(_car);
    this.roadData = [2,2,1,0];
    this.trafficLightData = [[5,3],[10,5]];

    this.lane_w = 60;
    this.road_w_h =0;
    this.road_w_v =0;

    this.timeLastMoment=Date.now();
    this.trafficLightCounterOffset = 0;
    this.trafficLightCounter = Date.now();
    this.fps = 0;
    
    this.trafficLightManager = new TrafficLight(this.trafficLightData,Date.now(),this.trafficLightCounterOffset);
    this.textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill : '#F7EDCA',
    }
    // this.app.loader
    // .add("vehicle",vehicle)
    // .add("ppl",ppl);
    // this.vehicleTexture = this.app.loader.resources["vehicle"].texture;
    // this.pedestrianTexture = this.app.loader.resources["ppl"].texture;
    
    // this.vehicle = new PIXI.Sprite(this.vehicleTexture);
    // this.vehicle2 = new PIXI.Sprite(this.vehicleTexture);
    // this.ppl = new PIXI.Sprite(this.pedestrianTexture);
    // this.ppl2 = new PIXI.Sprite(this.pedestrianTexture);
    this.vehicle = new PIXI.Graphics();
    this.vehicle2 = new PIXI.Graphics();
    this.ppl = new PIXI.Graphics();
    this.ppl2 = new PIXI.Graphics();
    this.pos_x =0; 
    this.pos_y=0;
  }

  // public componentDidMount(): void{
  //   // const {store} = this.props;
  // }

  initialize = () => {

    window.addEventListener('resize',this.resize);
    

    // this.ppl2 = new PIXI.Sprite(this.pedestrianTexture);

      this.drawRoad(this.road_G,this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer);
      // this.app.loader
      // .add("car",vehicle)
    //const car = new PIXI.Sprite(this.app.loader.resources["car"].texture);
    //car.zIndex = 1000;
    //car.visible = true;
      this.objectContainer.addChild(this.vehicle);
      this.objectContainer.addChild(this.vehicle2);
      this.objectContainer.addChild(this.ppl);
      this.objectContainer.addChild(this.ppl2);
    this.pos_x =0; 
    this.pos_y=0;
    
      //sprite position
      this.vehicle.x = this.app.renderer.width/2 + this.pos_x;
      this.vehicle.y = this.app.renderer.height/2 + this.pos_y;

      
      this.vehicle2.x = this.app.renderer.width/2 + this.pos_x;
      this.vehicle2.y = this.app.renderer.height/2 + this.pos_y;
      // this.vehicle3.y = 0;
      // this.vehicle3.y = 0;
      //sprite center point
      // this.vehicle.anchor.x = 0.5;
      // this.vehicle.anchor.y = 0.5;
      // this.vehicle2.anchor.x = 0.5;
      // this.vehicle2.anchor.y = 0.5;
      // this.vehicle2.alpha = 1.0;
      // this.ppl.anchor.x = 0.5;
      // this.ppl.anchor.y = 0.5;
      // this.ppl2.anchor.x = 0.5;
      // this.ppl2.anchor.y = 0.5;

      this.app.ticker.add(this.animation);
    //   this.objectContainer.addChild(this.car.render());
      
  };
  setup = () => {
  this.app.loader
       .add("vehicle2",vehicle)
       .add("ppl2",ppl)
       .load(this.initialize);
  };

  resize = () => {
    let _w = window.innerWidth;
    let _h = window.innerHeight;
    this.app.renderer.resize(_w,_h);
    this.drawRoad(this.road_G,this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer);
    
  }

  updateCar = (element:any) => {
      
      this.pixiContent = element;
      if(this.pixiContent && this.pixiContent.children.length<=0) {
        this.pixiContent.appendChild(this.app.view);
        this.setup();
        //this.app.renderer.render(this.app.stage);
      }
  };

  drawRoad=(object_G:PIXI.Graphics,laneDirLeft:number,laneDirRight:number,laneDirTop:number,laneDirDown:number,container:PIXI.Container)=>{
    const lane_w = 60;
    const line_w = 4;
    const zLine_w = 10;
    this.road_w_h =(laneDirLeft+laneDirRight)*lane_w;
    this.road_w_v =(laneDirTop+laneDirDown)*lane_w;
    const _w = this.app.renderer.width;
    const _h = this.app.renderer.height;
    const road = object_G;
    this.backGround_G.clear();
    this.backGround_G.beginFill(0x1111ab);
    this.backGround_G.drawRect(0,0,_w,_h);
    object_G.clear()
    //draw road base
    road.beginFill(0x575757);
    road.drawRect(0,_h/2-(this.road_w_h/2),_w,this.road_w_h);
    road.drawRect(_w/2-(this.road_w_v/2),0,this.road_w_v,_h);
    
    //draw side walk
    road.beginFill(0xcccccc);
    if(laneDirLeft+laneDirRight!==0)
    {
        road.drawRect(0, _h/2-(this.road_w_h/2), _w/2-this.road_w_v/2, -lane_w);
        road.drawRect(0, _h/2+(this.road_w_h/2), _w/2-this.road_w_v/2, lane_w);
        road.drawRect(_w, _h/2-(this.road_w_h/2), -(_w/2-this.road_w_v/2), -lane_w);
        road.drawRect(_w, _h/2+(this.road_w_h/2), -(_w/2-this.road_w_v/2), lane_w);
    }
    if(laneDirTop+laneDirDown!==0)
    {
    road.drawRect(_w/2-this.road_w_v/2, 0, -lane_w, _h/2-this.road_w_h/2);
    road.drawRect(_w/2+this.road_w_v/2, 0, lane_w, _h/2-this.road_w_h/2);
    road.drawRect(_w/2-this.road_w_v/2, _h, -lane_w, -(_h/2-this.road_w_h/2));
    road.drawRect(_w/2+this.road_w_v/2, _h, lane_w, -(_h/2-this.road_w_h/2));
    }
    
    //draw road lines
    //yellow line
    road.beginFill(0xffca57);
    if(laneDirLeft!==0&&laneDirRight!==0)
    {
      const midlinePos_h = (laneDirLeft - (laneDirLeft+laneDirRight)/2)*lane_w - line_w/2;
      var lineLength; 
      if(laneDirTop+laneDirDown!==0){
          lineLength = _w/2-this.road_w_v/2-lane_w*1.2;
      }else{
          lineLength = _w/2-this.road_w_v/2-lane_w*0.7;
      }
      road.drawRect(0,_h/2+(midlinePos_h),lineLength,line_w);
      road.drawRect(_w,_h/2+(midlinePos_h),-(lineLength),line_w);
    }
    if(laneDirTop!==0&&laneDirDown!==0)
    {
      const midlinePos_v = -(laneDirTop - (laneDirTop+laneDirDown)/2)*lane_w - line_w/2;
      var lineLength; 
      if(laneDirLeft+laneDirRight!==0){
          lineLength = _h/2-this.road_w_h/2-lane_w*1.2;
      }else{
          lineLength = _h/2-this.road_w_h/2-lane_w*0.7;
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
              lineLength = _w/2-this.road_w_v/2-lane_w*1.2;
          }else{
              lineLength = _w/2-this.road_w_v/2-lane_w*0.7;
          }
          this.drawDashLine(road,[0,_h/2+linePos],[(lineLength),_h/2+linePos],0.6,lineLength/lane_w,this.mapContainer,line_w,0xffffff);
          
          this.drawDashLine(road,[_w,_h/2+linePos],[(_w-lineLength),_h/2+linePos],0.6,lineLength/lane_w,this.mapContainer,line_w,0xffffff);
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
              lineLength = _h/2-this.road_w_h/2-lane_w*1.2;
          }else{
              lineLength = _h/2-this.road_w_h/2-lane_w*0.7;
          }
          this.drawDashLine(road,[_w/2+(linePos),0],[_w/2+(linePos),lineLength],0.6,lineLength/lane_w,this.mapContainer,line_w,0xffffff);
          
          this.drawDashLine(road,[_w/2+(linePos),_h],[_w/2+(linePos),_h-lineLength],0.6,lineLength/lane_w,this.mapContainer,line_w,0xffffff);
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
          linePos_x = _w/2+this.road_w_v/2+lane_w*1.2;
      }else{
          linePos_x = _w/2+this.road_w_v/2+lane_w*0.7;
      }
      road.drawRect(linePos_x,_h/2+(linePos_y),8,-lane_w*laneDirLeft+line_w/2);
    }
    if(laneDirRight!==0)
    {
      const linePos_y = (laneDirLeft - (laneDirLeft+laneDirRight)/2)*lane_w ;
      var linePos_x;
      if(laneDirTop+laneDirDown!==0)
      {
          linePos_x = _w/2-this.road_w_v/2-lane_w*1.2;
      }else{
          linePos_x = _w/2-this.road_w_v/2-lane_w*0.7;
      }
      road.drawRect(linePos_x, _h/2+(linePos_y),-8,lane_w*laneDirRight-line_w/2);
    }
    if(laneDirTop!==0)
    {
      const linePos_x = (laneDirTop - (laneDirTop+laneDirDown)/2)*lane_w;
      var linePos_y;
      if(laneDirLeft+laneDirRight!==0)
      {
          linePos_y = _h/2+this.road_w_h/2+lane_w*1.2;
      }else{
          linePos_y = _h/2+this.road_w_h/2+lane_w*0.7;
      }
      road.drawRect(_w/2-(linePos_x), linePos_y,lane_w*laneDirTop-line_w/2,8);
    }
    if(laneDirDown!==0)
    {
      const linePos_x = (laneDirTop - (laneDirTop+laneDirDown)/2)*lane_w;
      var linePos_y;
      if(laneDirLeft+laneDirRight!==0)
      {
          linePos_y = _h/2-this.road_w_h/2-lane_w*1.2;
      }else{
          linePos_y = _h/2-this.road_w_h/2-lane_w*0.7;
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
    
    console.log("this.road_G");
    console.log(this.road_G);
    
  }

  drawDashLine=(dashLine:PIXI.Graphics,startPos:Array<number>,endPos:Array<number>,dashLengthRatio:number,dashNum:number,container:any,width:number,color:any)=>{
      
      dashLine.lineStyle(width,color);
      const unitLength = [(endPos[0]-startPos[0])/dashNum,(endPos[1]-startPos[1])/dashNum];

      for(var i =-1; i<dashNum-1;i++){
          const tempPos = [startPos[0]+unitLength[0]*i+unitLength[0]*(1-dashLengthRatio),startPos[1]+unitLength[1]*i+unitLength[1]*(1-dashLengthRatio)];
          dashLine.moveTo(tempPos[0],tempPos[1]);
          dashLine.lineTo(tempPos[0]+unitLength[0]*dashLengthRatio,tempPos[1]+unitLength[1]*dashLengthRatio);
      }
      
  }

  drawTrafficLight=(laneDirLeft:number,laneDirRight:number,laneDirTop:number,laneDirDown:number,container:any,initGreenDirV:boolean, gTime:number,yTime:number,gTime2:number,yTime2:number)=>{
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
    this.trafficLight_G.clear();

    var TLPosOffset_x = 0,TLPosOffset_y = 0;
    const trafficLightStates = [this.trafficLightManager.getTrafficLightStateAtDirection(0), this.trafficLightManager.getTrafficLightStateAtDirection(1)];
    var str = ["","","",""];
    
    
    //draw hori direction
    if(trafficLightStates[0][0] === 1)
    {
      this.trafficLight_G.beginFill(0x00ff00);
      str[0] = "Towards West : Green  | " + trafficLightStates[0][1];
      str[1] = "Towards East : Green  | " + trafficLightStates[0][1];
    }else if (trafficLightStates[0][0] === 2)
    {
      this.trafficLight_G.beginFill(0xffbb00);
      str[0] = "Towards West : Orange | " + trafficLightStates[0][1];
      str[1] = "Towards East : Orange | " + trafficLightStates[0][1];
    }else{
      this.trafficLight_G.beginFill(0xff0000);
      str[0] = "Towards West : Red    | " + trafficLightStates[0][1];
      str[1] = "Towards East : Red    | " + trafficLightStates[0][1];
    }
    if(road_w_v!==0&&road_w_h!==0){
      TLPosOffset_x = road_w_v/2 + lane_w;
      TLPosOffset_y = road_w_h/2 + lane_w;
    }else if(road_w_v===0){
      TLPosOffset_x = road_w_v/2 + lane_w/2;
      TLPosOffset_y = road_w_h/2 + lane_w;
    }else if(road_w_h===0){
      TLPosOffset_x = road_w_v/2 + lane_w *0.2;
      TLPosOffset_y = road_w_h/2 + lane_w *1.3;
    }
    //towards west
    this.trafficLight_G.drawCircle(_w/2 - (TLPosOffset_x),_h/2 - (TLPosOffset_y - lane_w*0.8),_r);
    
    //towards east
    this.trafficLight_G.drawCircle(_w/2 + (TLPosOffset_x),_h/2 + (TLPosOffset_y - lane_w*0.8),_r); 
    

    if(trafficLightStates[1][0] === 1)
    {
      this.trafficLight_G.beginFill(0x00ff00);
      str[2] = "Towards North: Green  | " + trafficLightStates[1][1];
      str[3] = "Towards South: Green  | " + trafficLightStates[1][1];
    }else if (trafficLightStates[1][0] === 2)
    {
      this.trafficLight_G.beginFill(0xffbb00);
      str[2] = "Towards North: Orange | " + trafficLightStates[1][1];
      str[3] = "Towards South: Orange | " + trafficLightStates[1][1];
    }else{
      this.trafficLight_G.beginFill(0xff0000);
      str[2] = "Towards North: Red    | " + trafficLightStates[1][1];
      str[3] = "Towards South: Red    | " + trafficLightStates[1][1];
    }
    if(road_w_v!==0&&road_w_h!==0){
      TLPosOffset_x = road_w_v/2 + lane_w;
      TLPosOffset_y = road_w_h/2 + lane_w;
    }else if(road_w_v===0){
      TLPosOffset_x = road_w_v/2 + lane_w *1.3;
      TLPosOffset_y = road_w_h/2 + lane_w *0.2;
    }else if(road_w_h===0){
      TLPosOffset_x = road_w_v/2 + lane_w;
      TLPosOffset_y = road_w_h/2 + lane_w/2;
    }
    //towards north
    this.trafficLight_G.drawCircle(_w/2 - (TLPosOffset_x - lane_w*0.8), _h/2 + (TLPosOffset_y),_r);
    //towards south
    this.trafficLight_G.drawCircle(_w/2 + (TLPosOffset_x - lane_w*0.8), _h/2 - (TLPosOffset_y),_r); 
    
    this.displayPlaneContainer.removeChildren();
    const tlText = new PIXI.Text(str[0]+"\n"+str[1]+"\n"+str[2]+"\n"+str[3],this.textStyle);
    this.displayPlaneContainer.addChild(tlText);
  }

  animation = () => {
      
    const lane_w =60;
    this.drawTrafficLight(this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer,true,10,5,10,5);
    this.pos_x += 4;

    //sprite position
    this.vehicle.x = ((this.app.renderer.width/2 + this.pos_x-400)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    this.vehicle.y = (this.app.renderer.height/2 + this.pos_y+30);
    this.vehicle.rotation =PIXI.DEG_TO_RAD*180;
    this.vehicle2.x = ((this.app.renderer.width/2 -this.pos_x+400)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    
    this.vehicle2.y = (this.app.renderer.height/2 + this.pos_y-30)%this.app.renderer.height;
    this.vehicle2.rotation =PIXI.DEG_TO_RAD*0;


    this.ppl.x = ((this.app.renderer.width/2-this.road_w_v/2-lane_w/2)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    this.ppl.y = ((this.app.renderer.height/2 + this.pos_x/2-100)%this.app.renderer.height+this.app.renderer.height)%this.app.renderer.height;
    this.ppl2.x = ((this.app.renderer.width/2+this.road_w_v/2+lane_w/2)%this.app.renderer.width+this.app.renderer.width)%this.app.renderer.width;
    this.ppl2.y = ((this.app.renderer.height/2 - this.pos_x/2+100)%this.app.renderer.height+this.app.renderer.height)%this.app.renderer.height;

    let deltaTime = Date.now() -this.timeLastMoment;
    this.fps++;
    if(deltaTime>1000){
    
    //console.log (temp+"/"+this.timeC.toString()+" / "+this.fps+"fps   from scene");
    this.timeLastMoment =Date.now();
    this.fps=0;
    }
  }

  render = () => {
    console.log("this works");
      return (
        <div ref={(element) => {this.updateCar(element)}} />
           
      );
  }
};

// const mapStateToProps = (state: RootState): Props => ({
//   ...state,
// });

// function Scene(): JSX.Element {
//   console.log("this works");
//   return (
//     <div ref={(element) => {this.updateCar(element)}} />
//   );
// }

export default 
// connect(
//   mapStateToProps,
// )
(Scene);
