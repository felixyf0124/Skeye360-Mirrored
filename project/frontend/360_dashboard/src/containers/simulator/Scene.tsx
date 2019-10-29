//learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React, {Component} from 'react';
import { connect } from 'react-redux';
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
import { RootState } from '../../reducers/rootReducer';
import { Store } from 'redux';
import vehicle from '../../images/vehicle.png';
import ppl from '../../images/ppl.png';
import TrafficLight from './simulator_management/TrafficLight';
import TrafficLightMG from './simulator_management/TrafficLightManager';
import VehicleObj from './simulator_management/Vehicle';
import RoadIntersection from './simulator_management/RoadIntersection';
import * as ts from './TSGeometry'
import { Container, Button } from 'react-bootstrap';
import vec2 from './simulator_management/vec2';
import stopBlueImage from '../../images/stopBlue.png';
import stopRedImage from '../../images/stopRed.png';
import TrafficLightManager from './simulator_management/TrafficLightManager';
import TrafficLightManualControl from './simulator_management/TrafficLightManualControl';
import { number } from 'prop-types';

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
  controlPanelContainer: PIXI.Container;
  displayPlaneContainer: PIXI.Container;
  backGround_G: PIXI.Graphics;
  road_G: PIXI.Graphics;
  trafficLight_G: PIXI.Graphics;
  controlPanel_G: PIXI.Graphics;
  //should be removed after the roadintersection implemented
  //trafficLightManager: TrafficLightMG;
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

  trafficLightManualControl: TrafficLightManualControl;
  // trafficLightManager: TrafficLightManager;
  // trafficLightsArray:Array<TrafficLight>;
  hasTLColorChanged:Boolean;
  isEmergency:Boolean;
  isStopClicked:Boolean;

  constructor(props: any) {
    super(props);
    this.window_scale_ratio = 0.5;
    this.pixiContent = null;
    this.window_w = window.innerWidth*this.window_scale_ratio;
    this.window_h = window.innerHeight*this.window_scale_ratio;
    this.window_min=100;
    this.app = new PIXI.Application({width:this.window_w,height:this.window_h,resolution:window.devicePixelRatio});
    this.mapContainer = new PIXI.Container();
    this.objectContainer = new PIXI.Container();
    this.controlPanelContainer = new PIXI.Container(); //CONTROLPANEL
    this.displayPlaneContainer = new PIXI.Container();
    this.app.stage.addChild(this.mapContainer);
    this.app.stage.addChild(this.objectContainer);
    this.app.stage.addChild(this.displayPlaneContainer);
    this.app.stage.addChild(this.controlPanelContainer); //CONTROLPANEL
    this.backGround_G = new PIXI.Graphics();
    this.road_G = new PIXI.Graphics();
    this.trafficLight_G = new PIXI.Graphics();
    this.controlPanel_G =  new PIXI.Graphics();
    this.mapContainer.addChild(this.backGround_G);
    this.mapContainer.addChild(this.road_G);
    this.mapContainer.addChild(this.trafficLight_G);
    this.controlPanelContainer.addChild(this.controlPanel_G);
    this.coordinateOffset = {x:this.window_w/2,y:this.window_h/2};

    this.vehicleData = [{x:0,y:0}];
    //this.car = new VehicleObj(1,{x:this.window_w/2,y:0.0},1,0);
    this.roadData = [2,2,1,0];
    this.trafficLightData = [[5,5],[5,5]];

    //this.car.setVelocity(ts.tsVec2(-6,0));

    this.lane_w = 0.06*Math.min(this.window_w,this.window_h);
    this.road_w_h = 0;
    this.road_w_v = 0;

    this.timeLastMoment=Date.now();
    this.trafficLightCounterOffset = 0;
    this.trafficLightCounter = Date.now();
    this.fps = 0;
    this.fpsCounter = 0;

    //// START of initialization of Traffic Lights
    // this.trafficLightsArray = [];
    // for(let index = 0; index < 8; index++) {
    //   this.trafficLightsArray[index] = new TrafficLight(index, 0);
    //   if(index%2 == 0) {
    //     this.trafficLightsArray[index].setStatus("green");
    //   } else {
    //     this.trafficLightsArray[index].setStatus("red");
    //   }
    // }
    //// END of initialization of Traffic Lights

    //// Start of initialization of Traffic Light Manager
    //TrafficLightManager(0 --> is for the trafficLightManagerId, 0 --> is for the roadIntersectionId, Date.now, 0 --> is for the offset)
    //this.trafficLightManager = new TrafficLightManager(0, 0, 0);
    //this.trafficLightManager.setTrafficLightQueue(this.trafficLightsArray);
    //// END of initialization of Traffic Light Manager

    //// Start of Traffic Light Manual Control
    //TrafficLightManualControl(0 --> is the intersectionId)
    this.trafficLightManualControl = new TrafficLightManualControl(0);
    this.hasTLColorChanged = true;
    //// END of Traffic Light Manual Control

    //// START of initialization of Road Intersection
    this.roadIntersection = new RoadIntersection(0, ts.tsVec2(0,0));
    //this.trafficLightManager = new TrafficLightMG(this.roadIntersection.getRoadIntersectionId(),Date.now(),this.trafficLightCounterOffset);

    this.textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill : '#F7EDCA',
    }
    // this.app.loader
    // .add("vehicle",vehicle)
    // .add("ppl",ppl);
    
    this.vehicle = new PIXI.Sprite();
    console.log(" ang");
    console.log(ts.getAngleOfVec(new vec2(1,1))/Math.PI);
    
    //hard code to initial road intersection data for first loading
    this.roadIntersection.addNewRoadSection(ts.tsVec2(this.window_w/2, this.window_h*0.2));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(-this.window_w/2, 0.0));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(0.0, this.window_h/2));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(-30.0, -this.window_h/2));

    for(let i=0;i<this.roadIntersection.getRoadSections().length;++i)
    {
      this.roadIntersection.addNewLane(i,1,"straight",1);
      this.roadIntersection.addNewLane(i,-1,"straight",1);
    }

    this.roadIntersection.setLaneWidth(this.lane_w);

    var _trafficLight_binding_data = new Array<Array<{section:number,id:number}>>();
    _trafficLight_binding_data = [
      [
        {section:3,id:0},
        {section:1,id:0}
      ],
      [
        {section:2,id:0},
        {section:0,id:0}
      ]
    ];
    this.roadIntersection.addNewTrafficLight(_trafficLight_binding_data[0], 15);
    this.roadIntersection.addNewTrafficLight(_trafficLight_binding_data[1], 15);

    // for(let i = 0; i < _trafficLight_binding_data.length; ++i)
    // {
    //   this.roadIntersection.addNewTrafficLight(_trafficLight_binding_data[i], 15);
    // }
    //this.roadIntersection.resortRoadSections();
    var _inter = this.roadIntersection.updateLane();
    this.roadIntersection.resortTrafficLightQueue();
    // this.roadIntersection.
        console.log(this.roadIntersection.getRoadSections());


    this.app.stage.x = this.window_w/2;
    this.app.stage.y = this.window_h/2;
    //this.app.stage.scale.y=-1;

    const _test = new PIXI.Graphics();
    _test.lineStyle(1,0xff0000);
    for(let i =0;i<_inter.length;++i)
    {
      _test.moveTo(_inter[i][0].x,_inter[i][0].y);
      _test.lineTo(_inter[i][1].x,_inter[i][1].y);
    }

    this.mapContainer.addChild(_test);

    //// END of initialization of Road Intersection

    //// START of Control Panel
    // The following sets the positioning of the container
    this.controlPanelContainer.x = -this.coordinateOffset.x;
    this.controlPanelContainer.y = -this.coordinateOffset.y;
    this.controlPanel_G.beginFill(0x51BCD8,0.3)
    this.controlPanel_G.lineStyle(1, 0x51BCD8, 0.5);
    this.controlPanel_G.drawRect(0, 0, 200, this.window_h-1);
    this.controlPanel_G.endFill();

    const buttonTexture = PIXI.Texture.from('../../images/stopBlue.png');
    const buttonTextureRed = PIXI.Texture.from('../../images/stopRed.png');
    
    this.isStopClicked = false
    this.isEmergency = false;
    // The following imports an image for the button    
    
    //   .on('mouseout', onmouseout = () =>{
    //     this.isdown = false;
    // if (this.isOver) {
    //     this.texture = textureButtonOver;
    // } else {
    //     this.texture = textureButton;
    // }
    //   });
    //// END of Control Panel
  }

  initialize = () => {

    window.addEventListener('resize',this.resize);
    // this.backGround_G.clear();
    // this.backGround_G.beginFill(0x1111ab);
    // this.backGround_G.drawRect(0,0,this.window_w,this.window_h);
    this.drawRoad();
    //this.testdraw();
    this.createButtons();
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

  testdraw(){
    var _t = new PIXI.Graphics();
    //var _triangle = _obj_g;
    //console.log("ok 278 \n");
    var _vertices = new Array<vec2>();
    _vertices.push(new vec2(1,1));
    _vertices.push(new vec2(1,100));
    _vertices.push(new vec2(100,100));

    _t.lineStyle(1,0xffffff);
    
    _t.moveTo(-this.window_w,-this.window_h);
    _t.lineTo(this.window_w,this.window_h);
    // _t.endFill();
   
    _t.endFill();
    this.mapContainer.addChild(_t);
  }
  drawRoad=()=>{
    //this.mapContainer.removeChildren();
    this.road_G.clear();
    //this.road_G = new PIXI.Graphics();
    var _sections = this.roadIntersection.getRoadSections();
    // console.log(this.roadIntersection.roadSections);
    // console.log(_sections);
    const _red = 0xff0000;
    
    for(var i:number = 0; i < _sections.length; ++i)
    {
      var _lane_in = _sections[i].getLaneIn();
      var _lane_out = _sections[i].getLaneOut();
      var _color:number = 0xffffff;
      for(var j:number = 0; j < _lane_in.length; ++j)
      {
        let _lane = _lane_in[j];
        var _light_state:string = this.roadIntersection.getLaneState(i,j);
        //Sets the color of the traffic lights depending on the status 
        _color = this.getTrafficLightColor(_light_state);

        var _direction:vec2 = ts.tsNormalize(_lane.getHead().minus(_lane.getTail()));
        var _division:number = ts.tsLength(_lane.getHead().minus(_lane.getTail()))/(this.lane_w*0.4);
        for(var k:number = 0; k < _division; ++k)
        {
          var _topVertex = _lane.getHead().minus(_direction.multiply(this.lane_w*0.4*k));
          const _graphic_obj = this.drawTriangle(_topVertex,this.lane_w*0.3,this.lane_w*0.3,_direction,_color);
          this.mapContainer.addChild(_graphic_obj);
        }

        const _test = new PIXI.Graphics();
        _test.lineStyle(1,_red);
        _test.moveTo(_lane.getTail().x,_lane.getTail().y);
        _test.lineTo(_lane.getHead().x,_lane.getHead().y);
        this.mapContainer.addChild(_test);
      }

      for(let j:number = 0; j < _lane_out.length; ++j)
      {
        let _lane = _lane_out[j];
        //Sets the color of the traffic lights depending on the status 
        var _color2 = this.getTrafficLightColor("green");
        console.log("Emergency"+this.isEmergency);
        // if(this.isEmergency) {
        //   var _light_state:string = this.roadIntersection.getLaneState(i,j);
        //   _color2 = this.getTrafficLightColor(_light_state);
        // }

        
        var _direction:vec2 = ts.tsNormalize(_lane.getHead().minus(_lane.getTail()));
        var _division:number = ts.tsLength(_lane.getHead().minus(_lane.getTail()))/(this.lane_w*0.4)+1;
        for(var k:number = 1; k < _division; ++k)
        {
          var _topVertex = _lane.getTail().plus(_direction.multiply(this.lane_w*0.4*k));
          const _graphic_obj = this.drawTriangle(_topVertex,this.lane_w*0.3,this.lane_w*0.3,_direction,_color2);
          this.mapContainer.addChild(_graphic_obj);
        }

        const _test = new PIXI.Graphics();
        _test.lineStyle(1,_red);
        _test.moveTo(_lane.getTail().x,_lane.getTail().y);
        _test.lineTo(_lane.getHead().x,_lane.getHead().y);
        //this.mapContainer.addChild(_test);
      }
    }
  }

  getTrafficLightColor(light_state:string):number {
    const _green = 0x00ff00;
    const _yellow = 0xf5c842;
    const _red = 0xff0000;
    const _white = 0xffffff;
    switch(light_state){
      case "green":
        return _green;
      case "yellow":
        return _yellow;
      case "red":
        return _red;
      default:
        return _white;
    }
  }

  
  renderObjects = () => {
    this.objectContainer.removeChildren();

    // const _vehicle_texture = this.app.loader.resources["vehicle"].texture;
    // const _vehicle = new PIXI.Sprite(_vehicle_texture);
    // this.vehicle = new PIXI.Sprite(_vehicle_texture);

    // this.objectContainer.addChild(_vehicle);
  }

  animation = () => {
    if(this.hasTLColorChanged) {
      this.drawRoad();
      this.hasTLColorChanged = false;
    }
    if(this.roadIntersection.tlCountingDown())
    {
      this.drawRoad();
    }

    this.displayPlaneContainer.removeChildren();
    let deltaTime = Date.now() -this.timeLastMoment;
    this.fpsCounter++;
    if(deltaTime>1000){
      this.fps = this.fpsCounter;
      this.timeLastMoment =Date.now();
      this.fpsCounter=0;
    }
    
    const fpsText = new PIXI.Text("FPS: "+ this.fps,this.textStyle);
    fpsText.x = this.window_w/2 - 80;
    fpsText.y = -this.window_h/2;
    this.displayPlaneContainer.addChild(fpsText);
    // const _stopline = {
    //   x:(this.road_w_v/2 + 1.2)*this.lane_w,
    //   y:0
    // }
    // this.car.setStopLine(_stopline);
    const lane_w =60;
    // this.drawTrafficLight(this.roadData[0],this.roadData[1],this.roadData[2],this.roadData[3],this.mapContainer,true,10,5,10,5);
    // const _light_state = this.trafficLightManager.getTrafficLightStateAtDirection(0);

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


   drawTriangle(topVertex:vec2,height:number, width:number, direction:vec2, color:number) {
    const _triangle = new PIXI.Graphics();
    var _direction = ts.tsNormalize(direction);

    var _bottom = topVertex.minus(_direction.multiply(height));
    var _direction_perpendicular = ts.tsRotateByOrigin(_direction,Math.PI/2);
    var _vertices = new Array<vec2>();
    
    _vertices.push(topVertex);
    _vertices.push(_bottom.plus(_direction_perpendicular.multiply(width/2)));
    _vertices.push(_bottom.plus(_direction_perpendicular.multiply(-width/2)));

    _triangle.beginFill(color,1);
    _triangle.lineStyle(0.5,color,1);
    _triangle.moveTo(_vertices[0].x,_vertices[0].y);
    _triangle.lineTo(_vertices[1].x,_vertices[1].y);
    _triangle.lineTo(_vertices[2].x,_vertices[2].y);
    _triangle.lineTo(_vertices[0].x,_vertices[0].y);
    
    _triangle.endFill();
    return _triangle;
  };

  createButtons(){
    //const _stop_btn_texture = this.app.loader.resources["stopRedImage"].texture;
    const button = PIXI.Sprite.from(stopRedImage);
    // const button = PIXI.Sprite.from(stopRedImage);
    // const button = new PIXI.Sprite(buttonTextureRed);
    button.anchor.set(0.5);
    button.x = (this.controlPanel_G.width - button.width)/2;
    button.y = 100;
    button.buttonMode = true;
    button.interactive = true;
    button.buttonMode = true;
    // The following adds the button to the control panel container
    this.controlPanelContainer.addChild(button);

    // The following is for the button's event (onclick)
    button.on('mousedown', onclick = () => {
        if(this.isStopClicked == false) {
          this.isStopClicked = true;
        }
        console.log("button clicked"+this.isEmergency);
        this.hasTLColorChanged = true;
        this.isEmergency = true;
        //this.trafficLightManualControl.stopAllTrafficLights(this.trafficLightManager);
        for(let i = 0; i< this.roadIntersection.getTrafficLightQueue().length; ++i)
        {
          this.roadIntersection.forceTLState(this.roadIntersection.getTrafficLightQueue()[i].getId(),"red");
        }

      });
  }

};




export default 
(Scene);