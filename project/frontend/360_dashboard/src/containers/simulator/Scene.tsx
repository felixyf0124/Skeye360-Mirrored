/* eslint-disable @typescript-eslint/camelcase */
// learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React from 'react';
// pixi.js-legacy for VM
import * as PIXI from 'pixi.js-legacy';
import { connect } from 'react-redux';
import RoadIntersection from './simulator_management/RoadIntersection';
import * as ts from './TSGeometry';
import Vec2 from './simulator_management/vec2';
import Btn from './Button';
import DataFromCamera from './simulator_management/DataFromCamera';
import Vehicle from './simulator_management/Vehicle';
import LanePointer from './simulator_management/LanePointer';
import DragablePoint from './DragablePoint';
import mappingBGTexture from './intersection1.png';
import * as tsData from './TSLocalData';
import { RootState } from '../../reducers/rootReducer';
import { logClick } from '../../contexts/LogClicks';

// import 'pixi-text-input.js';

interface StateProps {
  intersection_id: string;
  camera_url: string;
}

interface DispatchProps {
  logClick: (log_message: string, user_id: number) => any;
}

/**
 * @class Scene
 * @extends {Component}
 */
class Scene extends React.Component<StateProps & DispatchProps> {
  pixiContent: any;

  windowW: number;

  windowH: number;

  windowMin: number;

  windowScaleRatio: number;

  app: PIXI.Application;

  mapContainer: PIXI.Container;

  objectContainer: PIXI.Container;

  controlPanelContainer: PIXI.Container;

  displayPlaneContainer: PIXI.Container;

  tlDisplayPanelContainer: PIXI.Container;

  laneAreaContainer: PIXI.Container;

  mappingBGContainer: PIXI.Container;

  backGroundG: PIXI.Graphics;

  roadG: PIXI.Graphics;

  trafficLightG: PIXI.Graphics;

  controlPanelG: PIXI.Graphics;

  roadIntersection: RoadIntersection;

  // the following should be moved outside when enable to connect with db
  roadData: Array<number>

  trafficLightData: Array<Array<number>>

  laneW: number;

  trafficLightCounterOffset: number;

  trafficLightCounter: number;

  timeLastMoment: number;

  fps: number;

  fpsCounter: number;

  textStyle: any;

  coordinateOffset: {x: number;y: number};

  vehicles: Array<Vehicle>;

  toggleGroup: Array<{name: string;state: boolean}>;

  btnGroup: Array<{text: PIXI.Text; btn: Btn}>;

  labelGroup: Array<Btn>;

  btnShowCP: Btn;

  btnStop: Btn;

  dragablePoints: Array<Array<DragablePoint>>;

  menuPage: number;

  menuBtns: Array<Btn>;

  isControlPanelShown: boolean;

  isCPAnimating: boolean;

  isStopClicked: boolean;

  lastBlinkState: boolean;

  numberOfCars: number;

  // for test map car
  countDown: number;

  deltaT: number;

  makeUpCar: Array<{atTline: number; num: number}>;

  atIndex: number;

  objRawData: string;

  constructor(props: any) {
    super(props);
    this.windowScaleRatio = 0.5;
    this.pixiContent = null;
    this.windowW = window.innerWidth * this.windowScaleRatio;
    this.windowH = window.innerHeight * this.windowScaleRatio;
    this.windowMin = 100;
    const resolution = window.devicePixelRatio;
    const setting = { width: this.windowW, height: this.windowH, resolution };
    this.app = new PIXI.Application(setting);
    this.mapContainer = new PIXI.Container();
    this.objectContainer = new PIXI.Container();
    this.controlPanelContainer = new PIXI.Container(); // CONTROLPANEL
    this.displayPlaneContainer = new PIXI.Container();
    this.tlDisplayPanelContainer = new PIXI.Container();
    this.laneAreaContainer = new PIXI.Container();
    this.mappingBGContainer = new PIXI.Container();
    this.app.stage.addChild(this.mapContainer);
    this.app.stage.addChild(this.objectContainer);
    this.app.stage.addChild(this.displayPlaneContainer);
    this.app.stage.addChild(this.controlPanelContainer); // CONTROLPANEL
    this.backGroundG = new PIXI.Graphics();
    this.roadG = new PIXI.Graphics();
    this.trafficLightG = new PIXI.Graphics();
    this.controlPanelG = new PIXI.Graphics();
    this.mapContainer.addChild(this.backGroundG);
    this.mapContainer.addChild(this.mappingBGContainer);
    this.mapContainer.addChild(this.roadG);
    this.mapContainer.addChild(this.trafficLightG);
    this.mapContainer.addChild(this.laneAreaContainer);
    this.controlPanelContainer.addChild(this.controlPanelG);
    this.controlPanelContainer.addChild(this.tlDisplayPanelContainer);
    this.coordinateOffset = { x: this.windowW / 2, y: this.windowH / 2 };

    this.vehicles = new Array<Vehicle>();

    this.roadData = [2, 2, 1, 0];
    this.trafficLightData = [[5, 5], [5, 5]];


    this.laneW = 0.06 * Math.min(this.windowW, this.windowH);

    this.timeLastMoment = Date.now();
    this.trafficLightCounterOffset = 0;
    this.trafficLightCounter = Date.now();
    this.fps = 0;
    this.fpsCounter = 0;

    // // START of initialization of Road Intersection
    this.roadIntersection = new RoadIntersection(0, ts.tsVec2(0, 0));

    this.textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill: '#F7EDCA',
    };

    // #### hard code to initial road intersection data for first loading
    this.roadIntersection.addNewRoadSection(ts.tsVec2(this.windowW / 2, this.windowH * 0.11));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(-this.windowW / 2, this.windowH * -0.12));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(this.windowW * -0.16, this.windowH / 2));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(this.windowW * 0.16, -this.windowH / 2));

    for (let i = 0; i < this.roadIntersection.getRoadSections().length; i += 1) {
      this.roadIntersection.addNewLane(i, 1, 'straight', 1);
      this.roadIntersection.addNewLane(i, -1, 'straight', 1);
    }

    this.roadIntersection.setLaneWidth(this.laneW);

    const lPointer1 = new LanePointer(0, 0);
    const lPointer2 = new LanePointer(1, 0);
    const lPointer3 = new LanePointer(2, 0);
    const lPointer4 = new LanePointer(3, 0);


    this.roadIntersection.linkLanes(lPointer1, lPointer2);
    this.roadIntersection.linkLanes(lPointer2, lPointer1);
    this.roadIntersection.linkLanes(lPointer3, lPointer4);
    this.roadIntersection.linkLanes(lPointer4, lPointer3);

    let trafficLightBindingData = new Array<Array<{section: number;id: number}>>();
    trafficLightBindingData = [
      [
        { section: 0, id: 0 },
        { section: 1, id: 0 },
      ],
      [
        { section: 2, id: 0 },
        { section: 3, id: 0 },
      ],
    ];
    this.roadIntersection.addNewTrafficLight(trafficLightBindingData[0], 20);
    this.roadIntersection.addNewTrafficLight(trafficLightBindingData[1], 20);

    this.roadIntersection.updateLane();
    this.roadIntersection.resortTrafficLightQueue();

    this.app.stage.x = this.windowW / 2;
    this.app.stage.y = this.windowH / 2;

    // // END of initialization of Road Intersection

    // // START of Control Panel
    // The following sets the positioning of the container
    this.controlPanelContainer.x = -this.coordinateOffset.x;
    this.controlPanelContainer.y = -this.coordinateOffset.y;
    this.controlPanelG.beginFill(0x51BCD8, 0.3);
    this.controlPanelG.lineStyle(1, 0x51BCD8, 0.5);
    this.controlPanelG.drawRect(0, 0, 220, this.windowH - 1);
    this.controlPanelG.endFill();

    this.isControlPanelShown = true;
    this.isCPAnimating = false;
    this.isStopClicked = false;
    this.btnShowCP = new Btn(26, 26, '<', 0x51BCD8);
    this.btnStop = new Btn(160, 26, 'FORCE STOP', 0x51BCD8, 0.5);
    this.lastBlinkState = false;

    this.btnGroup = new Array<{text: PIXI.Text; btn: Btn}>();
    this.toggleGroup = new Array<{name: string;state: boolean}>();
    this.labelGroup = new Array<Btn>();

    // toggle group
    const videoFeed = { name: 'enable video feed', state: true };
    const samplingVideoFeed = { name: 'enable sampling video feed', state: true };
    const uiV7 = { name: 'enable new UI v2.2', state: false };
    const showSectionAreas = { name: 'Show Section Areas', state: false };
    const showDirectVideoFeedMapping = { name: 'Show video feed mapping', state: false };
    const showVideoFeedBG = { name: 'Show video feed background', state: false };
    this.toggleGroup.push(videoFeed);
    this.toggleGroup.push(samplingVideoFeed);
    this.toggleGroup.push(uiV7);
    this.toggleGroup.push(showSectionAreas);
    this.toggleGroup.push(showDirectVideoFeedMapping);
    this.toggleGroup.push(showVideoFeedBG);


    // btn group
    for (let i = 0; i < this.toggleGroup.length; i += 1) {
      const toggleTxt = new PIXI.Text(this.toggleGroup[i].name);

      if (this.toggleGroup[i].state) {
        const toggleBtn = new Btn(36, 26, 'ON', 0x51BCD8, 0.5);
        this.btnGroup.push({ text: toggleTxt, btn: toggleBtn });
      } else {
        const toggleBtn = new Btn(36, 26, 'OFF', 0x51BCD8, 0.5);
        this.btnGroup.push({ text: toggleTxt, btn: toggleBtn });
      }
    }


    this.laneAreaContainer.x = -this.coordinateOffset.x;
    this.laneAreaContainer.y = -this.coordinateOffset.y;

    this.dragablePoints = new Array<Array<DragablePoint>>();
    const sectionAreas = tsData.loadSectionAreas();
    // this.dragablePoints.push(testP);
    for (let i = 0; i < sectionAreas.length; i += 1) {
      const sectionP = new Array<DragablePoint>();
      for (let j = 0; j < sectionAreas[i].length; j += 1) {
        const testP = new DragablePoint(sectionAreas[i][j], 5);
        sectionP.push(testP);
      }
      this.dragablePoints.push(sectionP);
    }
    // menu
    this.menuPage = 3;
    this.menuBtns = new Array<Btn>();
    const menuBtn1 = new Btn(49, 26, 'Traffic Light', 0x51BCD8);
    const menuBtn2 = new Btn(49, 26, 'Lane Area', 0x51BCD8);
    const menuBtn3 = new Btn(49, 26, 'Setting', 0x51BCD8);
    this.menuBtns.push(menuBtn1);
    this.menuBtns.push(menuBtn2);
    this.menuBtns.push(menuBtn3);


    this.app.stage.on('mouseup', onmouseup = (): void => {
      // console.log("User events: mouseup");
    });
    this.app.stage.on('mousedown', onmousedown = (): void => {
      // console.log("User events: mousedown");
    });
    this.app.stage.on('mouseover', onmouseover = (): void => {
      // console.log("User events: mouseover");
    });
    this.app.stage.on('mouseout', onmouseout = (): void => {
      // console.log("User events: mouseout");
    });
    // h c car obj

    this.numberOfCars = 3;
    for (let i = 0; i < 3; i += 1) {
      this.roadIntersection.addNewVehicle(0, 0, 0.06);
    }

    this.objRawData = '';

    this.countDown = Date.now();
    this.deltaT = 0;
    this.makeUpCar = [
      { atTline: 2800, num: 1 },
      { atTline: 3800, num: 1 },
      { atTline: 5600, num: 1 },
      { atTline: 6500, num: 1 },
      { atTline: 9500, num: 1 },
      { atTline: 10300, num: 1 },
      { atTline: 10900, num: 1 },
      { atTline: 11500, num: 1 },
      { atTline: 12000, num: 1 },
      { atTline: 12900, num: 2 },
      { atTline: 13500, num: 1 },
      { atTline: 14500, num: 1 },
      { atTline: 15800, num: 1 },
      { atTline: 16100, num: 1 },
      { atTline: 18900, num: 1 },
      { atTline: 20200, num: 1 },
      { atTline: 20900, num: 1 },
      { atTline: 22400, num: 1 },
      { atTline: 23400, num: 1 },
      { atTline: 25300, num: 1 },
      { atTline: 28000, num: 1 },
      { atTline: 29000, num: 1 },
      { atTline: 29900, num: 1 },
    ];


    this.atIndex = 0;

    this.app.loader.add('./intersection1.png');
  }

  /**
   * get color
   * @param lightState
   */
  static getColor(lightState: string): string {
    const green = '0x00ff00';
    const yellow = '0xf5c842';
    const red = '0xff0000';
    const skeyeBlue = '0x51bcd8';
    const white = '0xffffff';
    switch (lightState) {
      case 'green':
        return green;
      case 'yellow':
        return yellow;
      case 'red':
        return red;
      case 'skeye_blue':
        return skeyeBlue;
      default:
        return white;
    }
  }

  /**
   * old function for only retrieve total car number from video feed directly
   */
  async getNumberOfCars(): Promise<number> {
    const {
      camera_url,
    } = this.props;
    const rawData = await DataFromCamera.getDataFromCamera(camera_url) || '';
    const numberCars = await DataFromCamera.getNumberOfCars(rawData);
    // console.log(`Number of cars : ${numberCars}`);
    this.numberOfCars = numberCars;
    return numberCars;
  }

  /**
   * get certain toggle state by @param toggleName:string
   * @param toggleName
   */
  getToggleState(toggleName: string): boolean | null {
    for (let i = 0; i < this.toggleGroup.length; i += 1) {
      if (this.toggleGroup[i].name === toggleName) {
        return this.toggleGroup[i].state;
      }
    }
    return null;
  }

  /**
   * initial
   */
  initialize = (): void => {
    window.removeEventListener('resize', this.resize);
    window.addEventListener('resize', this.resize);

    this.initialButtons();

    this.mappingBGContainer.removeChildren();
    const { texture } = this.app.loader.resources.mappingBGTexture;
    const mappingBG = new PIXI.Sprite(texture);
    mappingBG.scale.x = this.windowW / texture.width;
    mappingBG.scale.y = this.windowH / texture.height;
    mappingBG.x = -this.coordinateOffset.x;
    mappingBG.y = -this.coordinateOffset.y;
    mappingBG.alpha = 0.6;
    this.mappingBGContainer.addChild(mappingBG);

    // the following two sequence matters, will affect the listeners;
    this.isControlPanelShown = false;
    this.isCPAnimating = true;
    this.updateControlPanelDisplayState(0);
    this.drawBackground(parseInt(Scene.getColor('skeye_blue'), 16), 0.16);
    this.drawRoad();
    this.renderObjects();
    this.drawLaneArea();
    this.app.ticker.add(this.animation);
  };

  /**
   * setup for loader
   */
  setup = (): void => {
    this.app.loader
      .add('mappingBGTexture', mappingBGTexture)
      .load(this.initialize);
  };

  /**
   * resize
   */
  resize = (): void => {
    if (window.innerWidth < this.windowMin) {
      this.windowW = this.windowMin;
      this.coordinateOffset.x = this.windowW / 2;
    } else {
      this.windowW = window.innerWidth * this.windowScaleRatio;
      this.coordinateOffset.x = this.windowW / 2;
    }
    if (window.innerHeight < this.windowMin) {
      this.windowH = this.windowMin;
      this.coordinateOffset.y = this.windowH / 2;
    } else {
      this.windowH = window.innerHeight * this.windowScaleRatio;
      this.coordinateOffset.y = this.windowH / 2;
    }
    this.app.renderer.resize(this.windowW, this.windowH);
    this.app.stage.x = this.windowW / 2;
    this.app.stage.y = this.windowH / 2;

    this.controlPanelG.clear();
    this.controlPanelG.beginFill(0x51BCD8, 0.3);
    this.controlPanelG.lineStyle(1, 0x51BCD8, 0.5);
    this.controlPanelG.drawRect(0, 0, 220, this.windowH - 1);
    this.controlPanelG.endFill();

    if (this.isControlPanelShown) {
      this.controlPanelContainer.x = -this.coordinateOffset.x;
      this.controlPanelContainer.y = -this.coordinateOffset.y;
    } else {
      this.controlPanelContainer.x = -this.controlPanelG.width - this.coordinateOffset.x;
      this.controlPanelContainer.y = -this.coordinateOffset.y;
    }

    this.drawBackground(parseInt(Scene.getColor('skeye_blue'), 16), 0.16);
    this.drawRoad();
    this.initialButtons();
    this.roadIntersection.updateVehiclePos();

    this.laneAreaContainer.x = -this.coordinateOffset.x;
    this.laneAreaContainer.y = -this.coordinateOffset.y;
    for (let i = 0; i < this.dragablePoints.length; i += 1) {
      for (let j = 0; j < this.dragablePoints[i].length; j += 1) {
        const pos = this.dragablePoints[i][j].absolutPos;

        this.dragablePoints[i][j].x = pos.x * this.windowW;
        this.dragablePoints[i][j].y = pos.y * this.windowH;
      }
    }
  }

  /**
   * bind & update html element
   */
  updateCar = (element: any): void => {
    this.pixiContent = element;
    if (this.pixiContent && this.pixiContent.children.length <= 0) {
      this.pixiContent.appendChild(this.app.view);
      this.setup();
    }
  };

  /**
   * draw road
   */
  drawRoad=(): void => {
    this.roadG.clear();
    this.roadG.removeChildren();

    const sections = this.roadIntersection.getRoadSections();
    const startBlinkTime = 10;

    const h = this.laneW * 0.3;
    const w = this.laneW * 0.3;
    for (let i = 0; i < sections.length; i += 1) {
      const laneIn = sections[i].getLaneIn();
      const laneOut = sections[i].getLaneOut();
      let color = 0xffffff;
      for (let j = 0; j < laneIn.length; j += 1) {
        const lane = laneIn[j];
        const cd = this.roadIntersection.getTrafficLightCD(lane.getTrafficLightId());

        const lightState: string = this.roadIntersection.getLaneState(lane.getRoadSectionId(), j);
        // Sets the color of the traffic lights depending on the status
        color = parseInt(Scene.getColor(lightState), 16);

        const direction = ts.tsNormalize(lane.getHead().minus(lane.getTail()));
        const division = ts.tsLength(lane.getHead().minus(lane.getTail())) / (this.laneW * 0.4);

        // this will draw from head to tail
        for (let k = 0; k < division; k += 1) {
          const topVertex = lane.getHead().minus(direction.multiply(this.laneW * 0.4 * k));
          const isForced = this.roadIntersection.isForced(lane.getTrafficLightId());

          if (isForced) {
            const laneGObj = this.drawTriangle(topVertex, h, w, direction, color);
            this.roadG.addChild(laneGObj);
          } else
          if (k < cd) {
            if (this.roadIntersection.isBlink()
            && cd <= startBlinkTime && lightState !== 'red') {
              const laneGObj = this.drawTriangle(topVertex, h, w, direction, color, true);
              laneGObj.alpha = 0.4;
              this.roadG.addChild(laneGObj);
            } else {
              const laneGObj = this.drawTriangle(topVertex, h, w, direction, color);
              this.roadG.addChild(laneGObj);
            }
          } else {
            const laneGObj = this.drawTriangle(topVertex, h, w, direction, color, true);
            laneGObj.alpha = 0.4;
            this.roadG.addChild(laneGObj);
          }
        }
      }

      for (let j = 0; j < laneOut.length; j += 1) {
        const lane = laneOut[j];
        // Sets the color of the traffic lights depending on the status
        const color2 = parseInt(Scene.getColor('skeye_blue'), 16);

        const direction = ts.tsNormalize(lane.getHead().minus(lane.getTail()));
        const division = ts.tsLength(lane.getHead().minus(lane.getTail())) / (this.laneW * 0.4) + 1;
        for (let k = 1; k < division; k += 1) {
          const topVertex = lane.getTail().plus(direction.multiply(this.laneW * 0.4 * k));
          const graphicObj = this.drawTriangle(topVertex, h, w, direction, color2);
          this.roadG.addChild(graphicObj);
        }
      }
    }
  }

  /**
   * render objects
   */
  renderObjects = (): void => {
    this.objectContainer.removeChildren();
    let vehicles: Array<Vehicle>;
    if (this.toggleGroup[0].state) {
      vehicles = this.roadIntersection.getSimpleVehicles();
      if (this.toggleGroup[2].state) {
        for (let i = 0; i < this.labelGroup.length; i += 1) {
          this.objectContainer.addChild(this.labelGroup[i]);
        }
      }
    } else {
      vehicles = this.roadIntersection.getVehicles();
    }
    if (!(this.toggleGroup[0].state
        && this.toggleGroup[2].state
        && !this.toggleGroup[4].state)) {
      for (let i = 0; i < vehicles.length; i += 1) {
        const position = vehicles[i].getPosition();
        if (Number.isNaN(vehicles[i].getRoadSectionId())) {
          const spot = this.drawVehicleSpot(position);
          this.objectContainer.addChild(spot);
        } else {
          const spot = this.drawVehicleSpot(position, 0xFFFFCC);
          this.objectContainer.addChild(spot);
        }
      }
    }
  }

  /**
   * animation
   * must bind with ticker
   */
  animation = (): void => {
    if (this.btnShowCP.isPressed()) {
      if (!this.isCPAnimating) {
        this.isControlPanelShown = !this.isControlPanelShown;
        this.isCPAnimating = true;
      }
    }
    this.updateControlPanelDisplayState(8);
    this.updateTLCountDownDisplayPanel();
    if (this.btnStop.isPressed()) {
      this.isStopClicked = !this.isStopClicked;
      if (this.isStopClicked) {
        for (let i = 0; i < this.roadIntersection.getTrafficLightQueue().length; i += 1) {
          this.roadIntersection.forceTLState(this.roadIntersection.getTrafficLightQueue()[i].getId(), 'red');
        }
      } else {
        for (let i = 0; i < this.roadIntersection.getTrafficLightQueue().length; i += 1) {
          const tempId = this.roadIntersection.getTrafficLightQueue()[i].getId();
          this.roadIntersection.deForceTLState(tempId);
        }
      }
    }

    this.updateLaneArea();

    // toggle btn
    this.updateToggleBtnState();
    // menu
    this.updateMenuState();
    this.drawMenu();

    this.roadIntersection.updateVehiclePos();

    if (this.toggleGroup[0].state) {
      this.vehicleUpdate(852, 478);
      this.sectionAreaCounter();
      this.countDown = Date.now();
    } else {
      // make up car loop
      if (this.atIndex < this.makeUpCar.length) {
        this.deltaT = Date.now() - this.countDown;
        let currentCD = 0;

        for (let i = 0; i < this.atIndex + 1; i += 1) {
          currentCD = this.makeUpCar[this.atIndex].atTline;
        }

        if (this.deltaT > currentCD) {
          this.roadIntersection.addNewVehicle(0, 0, 0.06);
          this.roadIntersection.addNewVehicle(0, 1, 0.06);
          this.roadIntersection.addNewVehicle(0, 2, 0.06);
          this.roadIntersection.addNewVehicle(0, 3, 0.06);
          this.atIndex += 1;
        }
      } else if (!this.toggleGroup[0].state) {
        this.countDown = Date.now();
        this.atIndex = 0;
      }

      this.numberOfCars = this.roadIntersection.getVehiclesNum();
    }


    if (this.isUpdate()) {
      this.roadIntersection.tlCountingDown();
      this.drawRoad();
    }
    this.renderObjects();
    // this.displayPlaneContainer.removeChildren();
    for (let i = this.displayPlaneContainer.children.length - 1; i >= 0; i -= 1) {
      const child = this.displayPlaneContainer.children[i];
      this.displayPlaneContainer
        .removeChild(child);
      child.destroy();
    }
    const deltaTime = Date.now() - this.timeLastMoment;
    this.fpsCounter += 1;
    if (deltaTime > 1000) {
      this.fps = this.fpsCounter;
      this.timeLastMoment = Date.now();
      this.fpsCounter = 0;
      // this.getNumberOfCars();
    }

    const fpsText = new PIXI.Text(`FPS: ${this.fps}`, this.textStyle);
    fpsText.x = this.windowW / 2 - 80;
    fpsText.y = -this.windowH / 2;
    this.displayPlaneContainer.addChild(fpsText);
    const numberCarsText = new PIXI.Text(`Cars:${this.numberOfCars}`, this.textStyle);
    numberCarsText.x = this.windowW / 2 - 80;
    numberCarsText.y = -this.windowH / 2 + 20;
    this.displayPlaneContainer.addChild(numberCarsText);

    const url = window.location.href;
    if (!url.includes('/camview/')) {
      this.unmountDestroy();
    }
  }

  /**
   * drawTriangl
   */
  drawTriangle = (topVertex: Vec2, height: number, width: number,
    direction: Vec2, color: number, isHollow?: boolean): PIXI.Graphics => {
    const triangle = new PIXI.Graphics();
    const dir = ts.tsNormalize(direction);
    let isHollo = false;
    if (isHollow !== undefined) {
      isHollo = isHollow;
    }

    const bottom = topVertex.minus(dir.multiply(height));
    const directionPerpendicular = ts.tsRotateByOrigin(dir, Math.PI / 2);
    const vertices = new Array<Vec2>();

    vertices.push(topVertex);
    vertices.push(bottom.plus(directionPerpendicular.multiply(width / 2)));
    vertices.push(bottom.plus(directionPerpendicular.multiply(-width / 2)));

    if (!isHollo) {
      triangle.beginFill(color, 1);
    }
    triangle.lineStyle(1, color, 1);
    triangle.moveTo(vertices[0].x, vertices[0].y);
    triangle.lineTo(vertices[1].x, vertices[1].y);
    triangle.lineTo(vertices[2].x, vertices[2].y);
    triangle.lineTo(vertices[0].x, vertices[0].y);

    if (!isHollo) {
      triangle.endFill();
    }
    return triangle;
  }

  /**
   * retrieve raw data from video feed
   */
  async retrieveRawData(): Promise<void> {
    const {
      camera_url,
    } = this.props;
    if (!this.toggleGroup[1].state) {
      const rawDataStr: string = await DataFromCamera.getDataFromCamera(camera_url) || 'async error';

      this.objRawData = rawDataStr;
    } else {
      this.objRawData = '(1, [524, 127])(2, [290, 166])(3, [747, 221])(4, [204, 192])(5, [537, 168])(6, [384, 203])(7, [60, 160])(8, [792, 247])(9, [95, 178])(10, [151, 185])(11, [528, 256])';
    }
  }

  // unmount content destroy
  unmountDestroy(): void {
    this.app.ticker.remove(this.animation);
    this.app.ticker.stop();
    this.app.destroy();
    this.btnShowCP.destroy();
    this.btnStop.destroy();
    this.backGroundG.destroy();
    this.mapContainer.destroy();
    this.objectContainer.destroy();
    this.controlPanelContainer.destroy();
    this.displayPlaneContainer.destroy();
    this.tlDisplayPanelContainer.destroy();
    this.roadG.destroy();
    this.trafficLightG.destroy();
    this.controlPanelG.destroy();
    delete this.windowW;
    delete this.windowH;
    delete this.windowMin;
    delete this.windowScaleRatio;
    delete this.roadIntersection;
    delete this.roadData;
    delete this.trafficLightData;
    delete this.laneW;
    delete this.trafficLightCounterOffset;
    delete this.trafficLightCounter;
    delete this.timeLastMoment;
    delete this.fps;
    delete this.fpsCounter;
    delete this.textStyle;
    delete this.coordinateOffset;
    delete this.vehicles;
    delete this.makeUpCar;
    delete this.pixiContent;
    delete this.context;
    delete this.render;
    delete this.toggleGroup;
    delete this.btnGroup;
    delete this.labelGroup;
    delete this.dragablePoints;
    delete this.menuPage;
    delete this.menuBtns;
    delete this.objRawData;
    delete this.laneAreaContainer;
    delete this.mappingBGContainer;
  }

  /**
   * update TL CountDown in control panel
   */
  updateTLCountDownDisplayPanel(): void {
    for (let i = this.tlDisplayPanelContainer.children.length - 1; i >= 0; i -= 1) {
      const child = this.tlDisplayPanelContainer.children[i];
      this.tlDisplayPanelContainer
        .removeChild(child);
      child.destroy();
    }
    const rowOffset = 26;
    const textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill: '0x51BCD8',
      fontWeight: '600',
    };

    const tHeader = new PIXI.Text('TL #   State   CD ', textStyle);

    this.tlDisplayPanelContainer.addChild(tHeader);


    const tlQueue = this.roadIntersection.getTrafficLightQueue();
    for (let i = 0; i < tlQueue.length; i += 1) {
      const index = (i + 1);
      // index
      const tDataId = new PIXI.Text(index.toString(), textStyle);
      tDataId.x = 8;
      tDataId.y = rowOffset * (i + 1);
      this.tlDisplayPanelContainer.addChild(tDataId);

      const color = Scene.getColor(tlQueue[i].getStatus());

      textStyle.fill = color;
      const tDataState = new PIXI.Text(tlQueue[i].getStatus(), textStyle);
      tDataState.x = tDataId.x + 42;
      tDataState.y = rowOffset * (i + 1);
      this.tlDisplayPanelContainer.addChild(tDataState);

      textStyle.fill = '0x51BCD8';
      let CD = 'N/A';
      if (!Number.isNaN(tlQueue[i].getCountDown())) {
        CD = Math.round(tlQueue[i].getCountDown()).toString();
      }
      const tDataCD = new PIXI.Text(CD, textStyle);
      tDataCD.x = tDataState.x + 56;
      tDataCD.y = rowOffset * (i + 1);
      this.tlDisplayPanelContainer.addChild(tDataCD);
    }
    const tempX = this.tlDisplayPanelContainer.width - this.controlPanelG.width;
    this.tlDisplayPanelContainer.x = Math.abs(tempX) / 2;
    this.tlDisplayPanelContainer.y = 20;
  }

  /**
   * draw background
   * @param color
   * @param alpha
   */
  drawBackground(color: number, alpha: number): void {
    this.backGroundG.clear();
    for (let i = this.backGroundG.children.length - 1; i >= 0; i -= 1) {
      const child = this.backGroundG.children[i];
      this.backGroundG
        .removeChild(child);
      child.destroy();
    }
    this.backGroundG.beginFill(color, alpha);
    this.backGroundG
      .drawRect(-this.coordinateOffset.x, -this.coordinateOffset.y, this.windowW, this.windowH);
    this.backGroundG.endFill();
  }


  /**
   * TO DO add new param of sycr time T,
   * So car will become more transparent based on delta T from last sycr
   * @param vertex
   */
  drawVehicleSpot(vertex: Vec2, col?: number): PIXI.Graphics {
    const spot = new PIXI.Graphics();
    let color = 0xc658fc;
    if (col !== undefined) {
      color = col;
    }
    spot.beginFill(color, 1);
    spot.drawCircle(vertex.x, vertex.y, this.laneW * 0.3);
    spot.endFill();
    return spot;
  }

  /**
   * button initial
   */
  initialButtons(): void {
    const color = 0x51BCD8;

    // pop - hide btn
    this.btnShowCP.setBackground(color, 0.1, 1, color);
    const textStyle = {
      fontFamily: 'Courier',
      fontSize: '12px',
      fill: '0x51BCD8',
      fontWeight: '600',
    };

    this.btnShowCP.setTextStyle(textStyle);


    this.btnShowCP.x = this.controlPanelG.width;
    if (this.btnShowCP.parent == null) {
      this.controlPanelContainer.addChild(this.btnShowCP);
    }
    this.updateControlPanelDisplayState(0);
    this.btnStop.setBackground(color, 0.1, 1, color);
    const textStyle2 = {
      // fontFamily: 'Courier',
      fontSize: '12px',
      fill: '#FFFFFF',
      fontWeight: '600',
    };
    this.btnStop.setTextStyle(textStyle2);
    this.btnStop.x = (this.controlPanelG.width - this.btnStop.width) / 2;
    this.btnStop.y = this.controlPanelG.height - 40;

    const textStyle3 = {
      fontSize: '11px',
      fill: '#FFFFFF',
    };
    for (let i = 0; i < this.toggleGroup.length; i += 1) {
      this.btnGroup[i].btn.setBackground(color, 0.1, 1, color);
      this.btnGroup[i].btn.setTextStyle(textStyle3);
      this.btnGroup[i].btn.x = this.controlPanelG.width * 0.75;
      this.btnGroup[i].btn.y = 20 + i * 26;


      this.btnGroup[i].text.style = textStyle3;
      this.btnGroup[i].text.x = 8;
      this.btnGroup[i].text.y = 20 + i * 26 + 6;
    }


    for (let i = 0; i < this.menuBtns.length; i += 1) {
      this.menuBtns[i].setTextStyle(textStyle);
      this.menuBtns[i].setDemansion(this.menuBtns[i].text.width + 12, 26);

      this.menuBtns[i].setBackground(color, 0.1, 1, color);
      this.menuBtns[i].setBoarder(1, color);

      this.menuBtns[i].angle = 90;
      this.menuBtns[i].x = this.controlPanelG.width
        + this.menuBtns[i].height - 1;
      this.menuBtns[i].setTextStyle(textStyle);
    }
    this.menuBtns[0].y = this.menuBtns[0].width / 2 - 26;
    this.menuBtns[1].y = this.menuBtns[0].y
      + this.menuBtns[0].width / 2
      + this.menuBtns[1].width / 2 + 12;
    this.menuBtns[2].y = this.menuBtns[1].y
      + this.menuBtns[1].width / 2
      + this.menuBtns[2].width / 2 + 6;


    const rSections = this.roadIntersection.getRoadSections();
    if (this.labelGroup.length === 0) {
      for (let i = 0; i < rSections.length; i += 1) {
        const lane = rSections[i].getLaneAt(0);
        const pos = (rSections[i].getTail().multiply(0.3)
          .plus(lane.getHead()));
        const labelG = new Btn(36, 36, 'car#', 0xc658fc);
        labelG.setTextStyle(textStyle3);
        labelG.interactive = false;
        labelG.buttonMode = false;
        labelG.x = pos.x - labelG.btnWidth / 2;
        labelG.y = pos.y - labelG.height / 2;
        this.labelGroup.push(labelG);
      }
    }
  }

  /**
   * draw menu
   */
  drawMenu(): void {
    const color = 0x51BCD8;
    this.controlPanelContainer.removeChildren();
    this.controlPanelContainer.addChild(this.controlPanelG);
    this.controlPanelContainer.addChild(this.btnShowCP);
    for (let i = 0; i < this.menuBtns.length; i += 1) {
      this.controlPanelContainer.addChild(this.menuBtns[i]);
    }
    if (this.toggleGroup[5].state) {
      this.mappingBGContainer.alpha = 1;
    } else {
      this.mappingBGContainer.alpha = 0;
    }

    switch (this.menuPage) {
      case 1:
      {
        if (this.laneAreaContainer.parent !== null) {
          this.mapContainer.removeChild(this.laneAreaContainer);
        }
        for (let i = 0; i < this.menuBtns.length; i += 1) {
          if (i === this.menuPage - 1) {
            this.menuBtns[i].setBoarder(2, color);
          } else {
            this.menuBtns[i].setBoarder(1, color);
          }
        }

        this.controlPanelContainer.addChild(this.tlDisplayPanelContainer);
        if (this.btnStop.parent == null) {
          this.controlPanelContainer.addChild(this.btnStop);
        }
        break;
      }
      case 2:
      {
        if (this.laneAreaContainer.parent == null) {
          this.mapContainer.addChild(this.laneAreaContainer);
        }
        for (let i = 0; i < this.menuBtns.length; i += 1) {
          if (i === this.menuPage - 1) {
            this.menuBtns[i].setBoarder(2, color);
          } else {
            this.menuBtns[i].setBoarder(1, color);
          }
        }

        break;
      }
      case 3:
      {
        if (this.laneAreaContainer.parent !== null
          && !this.toggleGroup[3].state) {
          this.mapContainer.removeChild(this.laneAreaContainer);
        }
        if (this.laneAreaContainer.parent == null
          && this.toggleGroup[3].state) {
          this.mapContainer.addChild(this.laneAreaContainer);
        }


        for (let i = 0; i < this.menuBtns.length; i += 1) {
          if (i === this.menuPage - 1) {
            this.menuBtns[i].setBoarder(2, color);
          } else {
            this.menuBtns[i].setBoarder(1, color);
          }
        }
        for (let i = 0; i < this.toggleGroup.length; i += 1) {
          if (this.btnGroup[i].btn.parent == null) {
            this.controlPanelContainer.addChild(this.btnGroup[i].btn);
          }
          if (this.btnGroup[i].text.parent == null) {
            this.controlPanelContainer.addChild(this.btnGroup[i].text);
          }
        }
        break;
      }
      default:
    }
  }

  /**
   * change current menu page when the related button is pressed
   */
  updateMenuState(): void{
    for (let i = 0; i < this.menuBtns.length; i += 1) {
      if (this.menuBtns[i].isPressed()) {
        this.menuPage = i + 1;
      }
    }
  }

  /**
   * update toggle btn state when the btn is pressed
   */
  updateToggleBtnState(): void{
    const color = 0x51BCD8;
    for (let i = 0; i < this.toggleGroup.length; i += 1) {
      if (i === 1) {
        if (this.toggleGroup[i - 1].state) {
          this.btnGroup[i].btn.interactive = true;
          this.btnGroup[i].btn.buttonMode = true;
          this.btnGroup[i].btn.setBoarder(1, color);
          if (this.btnGroup[i].btn.isPressed()) {
            this.toggleGroup[i].state = !this.toggleGroup[i].state;
          }
        } else {
          this.btnGroup[i].btn.interactive = false;
          this.btnGroup[i].btn.buttonMode = false;
          this.btnGroup[i].btn.setBoarder(0, color);
        }
      } else if (i === 4) {
        if (this.toggleGroup[i - 2].state) {
          this.btnGroup[i].btn.interactive = true;
          this.btnGroup[i].btn.buttonMode = true;
          this.btnGroup[i].btn.setBoarder(1, color);
          if (this.btnGroup[i].btn.isPressed()) {
            this.toggleGroup[i].state = !this.toggleGroup[i].state;
          }
        } else {
          this.btnGroup[i].btn.interactive = false;
          this.btnGroup[i].btn.buttonMode = false;
          this.btnGroup[i].btn.setBoarder(0, color);
        }
      } else if (this.btnGroup[i].btn.isPressed()) {
        this.toggleGroup[i].state = !this.toggleGroup[i].state;
      }
      let tgState: string;
      if (this.toggleGroup[i].state) {
        tgState = 'ON';
      } else {
        tgState = 'OFF';
      }
      this.btnGroup[i].btn.setName(tgState);
    }
  }

  /**
   * update control panel display state
   * @param animationSpeed
   */
  updateControlPanelDisplayState(animationSpeed: number): void {
    if (this.isControlPanelShown) {
      if (this.btnShowCP.name === '>') {
        this.showControlPanel(animationSpeed);
      }
    } else
    if (this.btnShowCP.name === '<') {
      this.hideControlPanel(animationSpeed);
    }
  }

  /**
   * hide animation for control panel in time @param animationSpeed
   * @param animationSpeed
   */
  hideControlPanel(animationSpeed: number): void {
    if (animationSpeed !== 0) {
      if (this.controlPanelContainer.x >= -this.controlPanelG.width - this.coordinateOffset.x) {
        this.controlPanelContainer.x -= animationSpeed;
      } else if (this.controlPanelContainer.x
        < -this.controlPanelG.width - this.coordinateOffset.x) {
        this.controlPanelContainer.x = -this.controlPanelG.width - this.coordinateOffset.x;
        this.btnShowCP.setName('>');
        this.isCPAnimating = false;
      }
    } else {
      this.controlPanelContainer.x = -this.controlPanelG.width - this.coordinateOffset.x;
      this.btnShowCP.setName('>');
      this.isCPAnimating = false;
    }
  }

  /**
   * show animation for control panel in time @param animationSpeed
   * @param animationSpeed
   */
  showControlPanel(animationSpeed: number): void {
    if (animationSpeed !== 0) {
      if (this.controlPanelContainer.x <= -this.coordinateOffset.x) {
        this.controlPanelContainer.x += animationSpeed;
      } else if (this.controlPanelContainer.x > -this.coordinateOffset.x) {
        this.controlPanelContainer.x = -this.coordinateOffset.x;
        this.btnShowCP.setName('<');
        this.isCPAnimating = false;
      }
    } else {
      this.controlPanelContainer.x = -this.coordinateOffset.x;
      this.btnShowCP.setName('<');
      this.isCPAnimating = false;
    }
  }

  /**
   * update traffic light blink state
   */
  isUpdate(): boolean {
    if (this.lastBlinkState !== this.roadIntersection.isBlink()) {
      this.lastBlinkState = this.roadIntersection.isBlink();
      return true;
    }
    return false;
  }


  /**
   * retrieve and update vehicle mapping
   * @param videoW
   * @param videoH
   */
  vehicleUpdate(videoW: number, videoH: number): void {
    this.retrieveRawData();
    // e.g. (1, [524, 127])(2, [290, 166])(3, [747, 221])
    const formedData = new Array<{id: number;position: Vec2}>();
    let startIndex = -1;
    let endIndex = -1;
    this.roadIntersection.initSimpleVehicles();

    for (let i = 0; i < this.objRawData.length; i += 1) {
      if (this.objRawData.charAt(i) === '(') {
        startIndex = i;
      } else if (this.objRawData.charAt(i) === ')' && startIndex > -1) {
        endIndex = i;

        const substr = this.objRawData.substring(startIndex + 1, endIndex);
        const simpleVehicleFormat = /\d+(\.\d+)?/g;

        const matchesArray = substr.match(simpleVehicleFormat);
        if (matchesArray != null) {
          const id = parseInt(matchesArray[0], 10);
          const x = (parseInt(matchesArray[1], 10) / videoW)
          * this.windowW - this.coordinateOffset.x;
          const y = (parseInt(matchesArray[2], 10) / videoH)
          * this.windowH - this.coordinateOffset.y;
          const pos = ts.tsVec2(x, y);
          const simpleVehicleData = { id, position: pos };
          formedData.push(simpleVehicleData);

          this.roadIntersection.tryAddSimpleVehicle(id, pos);
        }
      }
    }

    this.numberOfCars = this.roadIntersection.getSimpleVehicles().length;
  }

  /**
 * draw lane area
 * TODO draw the poly area for video feed
 */
  drawLaneArea(): void{
    this.laneAreaContainer.removeChildren();

    for (let i = 0; i < this.dragablePoints.length; i += 1) {
      for (let j = 0; j < this.dragablePoints[i].length; j += 1) {
        this.laneAreaContainer.addChild(this.dragablePoints[i][j]);
      }
    }
  }

  /**
   * update lane area if there is any change
   */
  updateLaneArea(): void{
    const pos = this.app.renderer.plugins.interaction.mouse.global;
    this.laneAreaContainer.removeChildren();

    for (let i = 0; i < this.dragablePoints.length; i += 1) {
      for (let j = 0; j < this.dragablePoints[i].length; j += 1) {
        if (this.dragablePoints[i][j].isDown) {
          const x = pos.x / this.windowW;
          const y = pos.y / this.windowH;
          this.dragablePoints[i][j].absolutPos = new Vec2(x, y);
        }
        const absPos = this.dragablePoints[i][j].absolutPos;
        this.dragablePoints[i][j].x = (absPos.x * this.windowW);
        this.dragablePoints[i][j].y = (absPos.y * this.windowH);
        this.laneAreaContainer.addChild(this.dragablePoints[i][j]);
      }
    }

    for (let i = 0; i < this.dragablePoints.length; i += 1) {
      const laneAreaEdge = new PIXI.Graphics();

      laneAreaEdge.lineStyle(1, 0xc658fc, 1);
      laneAreaEdge.moveTo(this.dragablePoints[i][this.dragablePoints[i].length - 1].x,
        this.dragablePoints[i][this.dragablePoints[i].length - 1].y);

      for (let j = 0; j < this.dragablePoints[i].length; j += 1) {
        laneAreaEdge.lineTo(this.dragablePoints[i][j].x, this.dragablePoints[i][j].y);
      }
      this.laneAreaContainer.addChild(laneAreaEdge);
    }
  }

  /**
 * count num of objects in each section area
 * based on video feed
 */
  sectionAreaCounter(): void {
    if (this.toggleGroup[0].state) {
      // const resoIntSec1 = new Vec2(852, 478);
      for (let i = 0; i < this.dragablePoints.length; i += 1) {
        const vObj = this.roadIntersection.getSimpleVehicles();
        const poly = new Array<Vec2>();
        for (let j = 0; j < this.dragablePoints[i].length; j += 1) {
          const absPos = this.dragablePoints[i][j].absolutPos;
          poly.push(new Vec2(absPos.x * this.windowW, absPos.y * this.windowH));
        }
        let secCarNum = 0;
        for (let j = 0; j < vObj.length; j += 1) {
          const pos = vObj[j].getPosition();
          const absPos = new Vec2(pos.x + this.coordinateOffset.x, pos.y + this.coordinateOffset.y);
          const isInside = ts.inside(absPos, poly);
          if (isInside != null && isInside) {
            secCarNum += 1;
            this.roadIntersection.simpleVehicles[j].setRoadSectionId(j);
          }
        }
        this.labelGroup[i].setName(secCarNum.toString());
      }
    }
  }

  // render
  public render(): JSX.Element {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <div
                  style={{
                    width: this.windowW,
                    minWidth: this.windowMin,
                    minHeight: this.windowMin,
                  }}
                  ref={(element): void => { this.updateCar(element); }}
                />
              </td>
              <td>
                {/* <img
                  style={{
                    width: this.windowW,
                    minWidth: this.windowMin,
                    minHeight: this.windowMin,
                  }}
                  src={`http://${camera_url}/cam`}
                  alt=""
                /> */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  intersection_id: state.intersection.intersection_id,
  camera_url: state.camera.camera_url,
});

const mapDispatchToProps: DispatchProps = {
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scene);
