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


/**
 * @class TryScene
 * @extends {Component}
 */
class TryScene extends Component {
  // class Scene extends Component<Props> {
  pixiContent: any;
  window_w:number;
  window_h:number;
  app: PIXI.Application;
  mapContainer: PIXI.Container;
  objectContainer: PIXI.Container;
  displayPlaneContainer: PIXI.Container;
  backGround_G: PIXI.Graphics;
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
  
  //vehicleTexture:PIXI.Texture;
  pedestrianTexture:PIXI.Texture;
  // vehicle:PIXI.Sprite;
  // vehicle2:PIXI.Sprite;
  // car:VehicleObj;
  ppl:PIXI.Sprite;
  ppl2:PIXI.Sprite;
  vehicle:any;
  vehicle2:PIXI.Graphics;
  car:VehicleObj;
  // ppl:PIXI.Graphics;
  // ppl2:PIXI.Graphics;
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
    this.app.stage.addChild(this.objectContainer);
    this.app.stage.addChild(this.displayPlaneContainer);
    this.backGround_G = new PIXI.Graphics();
    // [this.window_w/2,this.window_h/2]
    this.car = new VehicleObj([0.0,0.0],[0,0],0,0,80,40);
    
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
    this.app.loader
    .add("vehicle",vehicle)
    .add("ppl",ppl);
    //this.vehicleTexture = this.app.loader.resources["ppl"].texture;
    this.pedestrianTexture = this.app.loader.resources["ppl"].texture;
    
    // this.vehicle = new PIXI.Sprite(this.vehicleTexture);
    // this.vehicle2 = new PIXI.Sprite(this.vehicleTexture);
    this.ppl = new PIXI.Sprite(this.pedestrianTexture);
    this.ppl2 = new PIXI.Sprite(this.pedestrianTexture);
    this.vehicle = new PIXI.Graphics();
    this.vehicle2 = new PIXI.Graphics();
    // this.ppl = new PIXI.Graphics();
    // this.ppl2 = new PIXI.Graphics();
    this.pos_x =0; 
    this.pos_y=0;
  }

  // public componentDidMount(): void{
  //   // const {store} = this.props;
  // }

  initialize = () => {

    window.addEventListener('resize',this.resize);
    const _t = this.app.loader.resources["ppl"].texture;
    //this stupid variable will never show
    this.ppl2 = new PIXI.Sprite(this.pedestrianTexture);
    this.objectContainer.addChild(this.ppl2);
    // this local instance will show
    const _p = new PIXI.Sprite(_t);
    this.objectContainer.addChild(_p);
    const _car = new PIXI.Graphics();
    //_car => {this.car.render(_car)}
    //this.car.render(this.objectContainer);
    // _car.beginFill(0x0ff5f5);
    // _car.drawRect(100, 100, 200, 50);
    // _car.endFill();
    //this.objectContainer.addChild(_car));
    // this.ppl2 = new PIXI.Sprite(this.pedestrianTexture);

      // this.app.loader
      // .add("car",vehicle)
    //const car = new PIXI.Sprite(this.app.loader.resources["car"].texture);
    //car.zIndex = 1000;
    //car.visible = true;
    this.pos_x =0; 
    this.pos_y=0;
    
      //sprite position
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
    
  }

  updateCar = (element:any) => {
      
      this.pixiContent = element;
      if(this.pixiContent && this.pixiContent.children.length<=0) {
        this.pixiContent.appendChild(this.app.view);
        this.setup();
        //this.app.renderer.render(this.app.stage);
      }
  };



  animation = () => {
      
    
  };

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

export default TryScene;
