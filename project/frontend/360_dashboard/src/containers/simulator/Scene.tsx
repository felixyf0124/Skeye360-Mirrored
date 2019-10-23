//learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React, {Component} from 'react';
import { connect } from 'react-redux';
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
import { RootState } from '../../reducers/rootReducer';
import { Store } from 'redux';
import vehicle from '../../images/vehicle.png';
import ppl from '../../images/ppl.png';
import TrafficLight from './TrafficLight';
import { Root } from 'react-dom';
import VehicleObj from './VehicleObj';
import * as ts from './TSGeometry'
import styled from 'styled-components';
import Header from '../../components/Header';

const Feed = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding-left: 1.5rem;
  text-align: left;
  position: relative;
  height: 3rem;
  align-items: left;
`;

interface Props {
}

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
  fpsCounter:number;
  textStyle: any;
  
  coordinateOffset:{x:number,y:number};
  vehicle:PIXI.Sprite;
  vehicleData:Array<{x:number,y:number}>;
  car:VehicleObj;

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
    this.car = new VehicleObj([this.window_w/2,0.0],this.coordinateOffset,0,0,80,40);
    this.roadData = [2,2,1,0];
    this.trafficLightData = [[5,5],[5,5]];

    this.car.setVelocity(ts.tsVec2(-6,0));

    this.lane_w = 60;
    this.road_w_h = 0;
    this.road_w_v = 0;

    this.timeLastMoment=Date.now();
    this.trafficLightCounterOffset = 0;
    this.trafficLightCounter = Date.now();
    this.fps = 0;
    this.fpsCounter = 0;
    this.trafficLightManager = new TrafficLight(this.trafficLightData,Date.now(),this.trafficLightCounterOffset);
    this.textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill : '#F7EDCA',
    }
    this.app.loader
    .add("vehicle",vehicle)
    .add("ppl",ppl);
    
    this.vehicle = new PIXI.Sprite();

  }



  initialize = () => {

    window.addEventListener('resize',this.resize);
    
      this.drawRoad(this.road_G,this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer);

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
    this.drawRoad(this.road_G,this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer);
    
    this.car.setPositionOffset(this.coordinateOffset.x, this.coordinateOffset.y + this.window_h*this.window_scale_ratio*0.3);
  }

  updateCar = (element:any) => {
      
      this.pixiContent = element;
      if(this.pixiContent && this.pixiContent.children.length<=0) {
        this.pixiContent.appendChild(this.app.view);
        this.setup();
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
    
    // console.log("this.road_G");
    // console.log(this.road_G);
    
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
    
    const tlText = new PIXI.Text(str[0]+"\n"+str[1]+"\n"+str[2]+"\n"+str[3],this.textStyle);
    this.displayPlaneContainer.addChild(tlText);
  }
  renderObjects = () => {
    this.objectContainer.removeChildren();

    const _vehicle_texture = this.app.loader.resources["vehicle"].texture;
    const _vehicle = new PIXI.Sprite(_vehicle_texture);
    this.vehicle = new PIXI.Sprite(_vehicle_texture);

    _vehicle.x = this.car.getWorldPosition().x;
    _vehicle.y = this.car.getWorldPosition().y;
    this.vehicle.x = this.car.getWorldPosition().x;
    this.vehicle.y = this.car.getWorldPosition().y;
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
    this.car.setStopLine(_stopline);
    const lane_w =60;
    this.drawTrafficLight(this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer,true,10,5,10,5);
    const _light_state = this.trafficLightManager.getTrafficLightStateAtDirection(0);
    this.car.updateTranslate({light:_light_state[0],countDown:_light_state[1]});
    if(ts.tsLength(this.car.getPosition())>this.window_w*1.5)
    {
      this.car.setPosition(this.window_w*0.8,0.0);
    }
    this.renderObjects();

  }

  render = () => {
    // console.log("this works");
      return (
        <div>
          <Feed>
            <div style={{width:this.window_w, minWidth:this.window_min, minHeight:this.window_min}} ref={(element) => {this.updateCar(element)}} />
            <div>
              <img   style={{width:this.window_w, minWidth:this.window_min, minHeight:this.window_min}} src="http://52.170.42.166:8000/" />
            </div>
          </Feed>
        </div>
      );
  }
};


const mapStateToProps = (state: RootState): Props => ({
});

export default connect(
  mapStateToProps,
)(Scene);
