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
import VehicleObj from './simulator_management/Vehicle';
import RoadIntersection from './simulator_management/RoadIntersection';
import * as ts from './TSGeometry'
import Coordinate from './simulator_management/vec2';

/**
 * @class Scene
 * @extends {Component}
 */
class Scene extends Component {
  // class Scene extends Component<Props> {
  pixiContent: any;
  window_w:number;
  window_h:number;
  window_min:number;
  window_scale_ratio:number;
  app: PIXI.Application;
  mapContainer: PIXI.Container;
  objectContainer: PIXI.Container;
  displayPlaneContainer: PIXI.Container;
  backGround_G: PIXI.Graphics;
  road_G: PIXI.Graphics;
  trafficLight_G: PIXI.Graphics;
  //should be removed after the roadintersection implemented
  trafficLightManager: TrafficLight;
  roadIntersection: RoadIntersection;
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
  fpsCounter:number;
  textStyle: any;
  
  coordinateOffset:{x:number,y:number};
  vehicle:PIXI.Sprite;
  vehicleData:Array<{x:number,y:number}>;
  //car:VehicleObj;

  constructor(props: any) {
    super(props);
    this.window_scale_ratio = 0.5;
    this.pixiContent = null;
    this.window_w = window.innerWidth*this.window_scale_ratio;
    this.window_h = window.innerHeight*this.window_scale_ratio;
    this.window_min=100;
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
    this.coordinateOffset = {x:this.window_w*this.window_scale_ratio/2,y:this.window_h*this.window_scale_ratio/2};

    this.vehicleData = [{x:0,y:0}];
    //this.car = new VehicleObj(1,{x:this.window_w/2,y:0.0},1,0);
    this.roadData = [2,2,1,0];
    this.trafficLightData = [[5,5],[5,5]];

    //this.car.setVelocity(ts.tsVec2(-6,0));

    this.lane_w = 60;
    this.road_w_h = 0;
    this.road_w_v = 0;

    this.timeLastMoment=Date.now();
    this.trafficLightCounterOffset = 0;
    this.trafficLightCounter = Date.now();
    this.fps = 0;
    this.fpsCounter = 0;
    this.trafficLightManager = new TrafficLight(this.trafficLightData,Date.now(),this.trafficLightCounterOffset);
    this.roadIntersection = new RoadIntersection(0, ts.vec2(0,0));

    this.textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill : '#F7EDCA',
    }
    this.app.loader
    .add("vehicle",vehicle)
    .add("ppl",ppl);
    
    this.vehicle = new PIXI.Sprite();

    //
    this.roadIntersection.addNewRoadSection(ts.vec2(this.window_w/2, 0.0));
    

  }



  initialize = () => {

    window.addEventListener('resize',this.resize);
    

    this.app.ticker.add(this.animation);
      
  };
  setup = () => {
  this.app.loader
       .add("vehicle2",vehicle)
       .add("ppl2",ppl)
       .load(this.initialize);
  };

  resize = () => {
    if(window.innerWidth<this.window_min)
    {
      this.window_w = this.window_min;
      this.coordinateOffset.x = this.window_w*this.window_scale_ratio/2;
    }else
    {
      this.window_w = window.innerWidth*this.window_scale_ratio;
      this.coordinateOffset.x = this.window_w*this.window_scale_ratio/2;
    }
    if(window.innerHeight<this.window_min)
    {
      this.window_h = this.window_min;
      this.coordinateOffset.y = this.window_h*this.window_scale_ratio/2;
    }else
    {
      this.window_h = window.innerHeight*this.window_scale_ratio;
      this.coordinateOffset.y = this.window_h*this.window_scale_ratio/2;
    }
    this.app.renderer.resize(this.window_w,this.window_h);
    
    //this.car.setPositionOffset(this.coordinateOffset.x, this.coordinateOffset.y + this.window_h*this.window_scale_ratio*0.3);
  }

  updateCar = (element:any) => {
      
      this.pixiContent = element;
      if(this.pixiContent && this.pixiContent.children.length<=0) {
        this.pixiContent.appendChild(this.app.view);
        this.setup();
      }
  };



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
    
    const tlText = new PIXI.Text(str[0]+"\n"+str[1]+"\n"+str[2]+"\n"+str[3],this.textStyle);
    this.displayPlaneContainer.addChild(tlText);
  }
  renderObjects = () => {
    this.objectContainer.removeChildren();

    const _vehicle_texture = this.app.loader.resources["vehicle"].texture;
    const _vehicle = new PIXI.Sprite(_vehicle_texture);
    this.vehicle = new PIXI.Sprite(_vehicle_texture);

    this.objectContainer.addChild(_vehicle);
  }

  animation = () => {
    this.displayPlaneContainer.removeChildren();
    let deltaTime = Date.now() -this.timeLastMoment;
    this.fpsCounter++;
    if(deltaTime>1000){
      this.fps = this.fpsCounter;
      this.timeLastMoment =Date.now();
      this.fpsCounter=0;
    }
    
    const fpsText = new PIXI.Text("FPS: "+ this.fps,this.textStyle);
    fpsText.x = this.window_w - 80;
    this.displayPlaneContainer.addChild(fpsText);
    const _stopline = {
      x:(this.road_w_v/2 + 1.2)*this.lane_w,
      y:0
    }
   // this.car.setStopLine(_stopline);
    const lane_w =60;
    this.drawTrafficLight(this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer,true,10,5,10,5);
    const _light_state = this.trafficLightManager.getTrafficLightStateAtDirection(0);

  }

  render = () => {
    
    console.log("this works");
      return (
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <div style={{width:this.window_w, minWidth:this.window_min, minHeight:this.window_min}} ref={(element) => {this.updateCar(element)}} />
                </td>
                <td>
                  <img   style={{width:this.window_w, minWidth:this.window_min, minHeight:this.window_min}} src="http://52.170.42.166:8000/"></img>
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>
      );
  }
};


export default 
(Scene);
