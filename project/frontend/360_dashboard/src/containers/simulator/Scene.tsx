// learning reference https://medium.com/@peeyush.pathak18/pixijs-with-react-3cd40738180

import React, { Component } from 'react';
// pixi.js-legacy for VM
import * as PIXI from 'pixi.js-legacy';
import RoadIntersection from './simulator_management/RoadIntersection';
import * as ts from './TSGeometry';
import Vec2 from './simulator_management/vec2';
import Btn from './Button';
import DataFromCamera from './simulator_management/DataFromCamera';
import Vehicle from './simulator_management/Vehicle';
import LanePointer from './simulator_management/LanePointer';

/**
 * @class Scene
 * @extends {Component}
 */
class Scene extends Component {
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

  btnShowCP: Btn;

  btnStop: Btn;

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
    this.app.stage.addChild(this.mapContainer);
    this.app.stage.addChild(this.objectContainer);
    this.app.stage.addChild(this.displayPlaneContainer);
    this.app.stage.addChild(this.controlPanelContainer); // CONTROLPANEL
    this.backGroundG = new PIXI.Graphics();
    this.roadG = new PIXI.Graphics();
    this.trafficLightG = new PIXI.Graphics();
    this.controlPanelG = new PIXI.Graphics();
    this.mapContainer.addChild(this.backGroundG);
    this.mapContainer.addChild(this.roadG);
    this.mapContainer.addChild(this.trafficLightG);
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
    this.roadIntersection.addNewRoadSection(ts.tsVec2(this.windowW / 2, this.windowH * 0.2));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(-this.windowW / 2, 0.0));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(0.0, this.windowH / 2));
    this.roadIntersection.addNewRoadSection(ts.tsVec2(-30.0, -this.windowH / 2));

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
    this.controlPanelG.drawRect(0, 0, 200, this.windowH - 1);
    this.controlPanelG.endFill();

    this.isControlPanelShown = true;
    this.isCPAnimating = false;
    this.isStopClicked = false;
    this.btnShowCP = new Btn(26, 26, '<', 0x51BCD8);
    this.btnStop = new Btn(160, 26, 'FORCE STOP', 0x51BCD8, 0.5);
    this.lastBlinkState = false;

    // this.numberOfCars = 0;

    // To call method to get real time data from the camera feed
    // this.getRealTimeData();
    // To get the number of cars currently in the camera feed
    // this.getNumberOfCars();


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
  }

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

  async getNumberOfCars(): Promise<number> {
    const rawData = await DataFromCamera.getDataFromCamera() || '';
    const numberCars = await DataFromCamera.getNumberOfCars(rawData);
    // console.log(`Number of cars : ${numberCars}`);
    this.numberOfCars = numberCars;
    return numberCars;
  }


  initialize = (): void => {
    window.removeEventListener('resize', this.resize);
    window.addEventListener('resize', this.resize);

    this.initialButtons();

    // the following two sequence matters, will affect the listeners;
    this.isControlPanelShown = false;
    this.isCPAnimating = true;
    this.updateControlPanelDisplayState(0);
    this.drawBackground(parseInt(Scene.getColor('skeye_blue'), 16), 0.16);
    this.drawRoad();
    this.renderObjects();

    this.app.ticker.add(this.animation);
  };

  setup = (): void => {
    this.app.loader
      .load(this.initialize);
  };

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

    if (this.isControlPanelShown) {
      this.controlPanelContainer.x = -this.coordinateOffset.x;
      this.controlPanelContainer.y = -this.coordinateOffset.y;
    } else {
      this.controlPanelContainer.x = -this.controlPanelG.width - this.coordinateOffset.x;
      this.controlPanelContainer.y = -this.coordinateOffset.y;
    }

    this.drawBackground(parseInt(Scene.getColor('skeye_blue'), 16), 0.16);
    this.drawRoad();
  }

  updateCar = (element: any): void => {
    this.pixiContent = element;
    if (this.pixiContent && this.pixiContent.children.length <= 0) {
      this.pixiContent.appendChild(this.app.view);
      this.setup();
    }
  };

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


  renderObjects = (): void => {
    this.objectContainer.removeChildren();
    const vehicles = this.roadIntersection.getVehicles();

    for (let i = 0; i < vehicles.length; i += 1) {
      const position = vehicles[i].getPosition();
      this.objectContainer.addChild(this.drawVehicleSpot(position));
    }
  }

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

    if (this.atIndex < this.makeUpCar.length) {
      this.deltaT = Date.now() - this.countDown;
      let currentCD = 0;

      for (let i = 0; i < this.atIndex + 1; i += 1) {
        currentCD = this.makeUpCar[this.atIndex].atTline;
      }

      if (this.deltaT > currentCD) {
        this.roadIntersection.addNewVehicle(0, 3, 0.06);
        this.atIndex += 1;
      }
    }

    if (this.isUpdate()) {
      this.roadIntersection.tlCountingDown();
      this.drawRoad();
    }
    this.roadIntersection.updateVehiclePos();
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
      this.getNumberOfCars();
    }

    const fpsText = new PIXI.Text(`FPS: ${this.fps}`, this.textStyle);
    fpsText.x = this.windowW / 2 - 80;
    fpsText.y = -this.windowH / 2;
    this.displayPlaneContainer.addChild(fpsText);
    // const numOfCar = this.roadIntersection.getVehiclesNum();
    // const numberCarsText = new PIXI.Text(`Cars: ${numOfCar}`, this.textStyle);
    const numberCarsText = new PIXI.Text(`Cars:${this.numberOfCars}`, this.textStyle);
    numberCarsText.x = this.windowW / 2 - 80;
    numberCarsText.y = -this.windowH / 2 + 20;
    this.displayPlaneContainer.addChild(numberCarsText);

    const url = window.location.href;
    if (!url.includes('/streetview/')) {
      this.unmountDestroy();
    }
  }

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
  }

  // render
  render = (): JSX.Element => (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <div
                style={{ width: this.windowW, minWidth: this.windowMin, minHeight: this.windowMin }}
                ref={(element): void => { this.updateCar(element); }}
              />
            </td>
            <td>
              <img
                style={{ width: this.windowW, minWidth: this.windowMin, minHeight: this.windowMin }}
                src="http://40.121.47.195:8000/cam"
                alt=""
              />
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  )

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
  drawVehicleSpot(vertex: Vec2): PIXI.Graphics {
    const spot = new PIXI.Graphics();
    const color = 0xc658fc;
    spot.beginFill(color, 1);
    spot.drawCircle(vertex.x, vertex.y, this.laneW * 0.3);
    spot.endFill();
    return spot;
  }

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
    this.controlPanelContainer.addChild(this.btnShowCP);
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
    this.controlPanelContainer.addChild(this.btnStop);
  }

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

  isUpdate(): boolean {
    if (this.lastBlinkState !== this.roadIntersection.isBlink()) {
      this.lastBlinkState = this.roadIntersection.isBlink();
      return true;
    }
    return false;
  }
}


export default
(Scene);
