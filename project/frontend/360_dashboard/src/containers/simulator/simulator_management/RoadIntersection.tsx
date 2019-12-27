import RoadSection from './RoadSection';
import Lane from './Lane';
import Vec2 from './vec2';
import * as ts from '../TSGeometry';
import LanePointer from './LanePointer';
import TrafficLightManager from './TrafficLightManager';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {
    id: number;

    // mapCoordinate:{x:number,y:number};
    mapCoordinate: Vec2;

    roadSections: Array<RoadSection>;

    TLManager: TrafficLightManager;

    laneWidth: number;

    vehicles: Array<Vehicle>;

    //this array is for simple mapping vehicles
    simpleVehicles: Array<Vehicle>;

    vehicleCount: number;

    constructor(id: number, mapCoordinate: Vec2, TLManager?: TrafficLightManager) {
      this.id = id;
      this.mapCoordinate = mapCoordinate;
      this.roadSections = new Array<RoadSection>();
      this.TLManager = TLManager || new TrafficLightManager(id);
      this.laneWidth = 0;
      this.vehicles = new Array<Vehicle>();
      this.simpleVehicles = new Array<Vehicle>();
      this.vehicleCount = 0;
    }

    // Getters
    getId(): number {
      return this.id;
    }

    getMapCoordinate(): Vec2 {
      return this.mapCoordinate;
    }

    getRoadSections(): Array<RoadSection> {
      return this.roadSections;
    }

    getRoadSection(id: number): RoadSection {
      for (let i = 0; i < this.roadSections.length; i += 1) {
        if (this.roadSections[i].getId() === id) {
          return this.roadSections[i];
        }
      }
      return new RoadSection(-1, -1, new Vec2());
    }

    getRoadSectionIndex(id: number): number {
      let index = -1;
      for (let i = 0; i < this.roadSections.length; i += 1) {
        if (this.roadSections[i].getId() === id) {
          index = i;
          break;
        }
      }
      return index;
    }

    getLane(laneId: number, sectionId: number, isLaneIn?: boolean): Lane {
      const lane = this.getRoadSection(sectionId).getLaneAt(laneId, isLaneIn);
      return lane;
    }

    getTrafficLightQueue(): Array<TrafficLight> {
      return this.TLManager.getTrafficLightQueue();
    }

    getTrafficLightState(id: number): string {
      return this.TLManager.getTrafficLightState(id);
    }

    getTrafficLightCD(id: number): number {
      return Math.round(this.TLManager.getTrafficLightCD(id));
    }

    getLaneState(sectionId: number, laneId: number, isLaneIn?: boolean): string {
      const isLIn: boolean = isLaneIn || true;
      if (isLIn) {
        const trafficLightId = this.roadSections[this.getRoadSectionIndex(sectionId)]
          .getLaneAt(laneId).getTrafficLightId();
        return this.getTrafficLightState(trafficLightId);
      }
      return 'green';
    }

    getVehicle(id: number): Vehicle {
      for (let i = 0; i < this.vehicles.length; i += 1) {
        if (this.vehicles[i].getId() === id) {
          return this.vehicles[i];
        }
      }
      return new Vehicle(-1, -1, -1, -1);
    }

    getVehicles(): Array<Vehicle> {
      return this.vehicles;
    }

    getSimpleVehicles(): Array<Vehicle> {
      return this.simpleVehicles;
    }

    getVehiclesNum(): number {
      return this.vehicles.length;
    }

    // Setters
    setMapCoordinate(mapCoordinate: Vec2): void {
      this.mapCoordinate = mapCoordinate;
    }

    /**
     * This also updates all lane positions
     * @param width
     */
    setLaneWidth(width: number): void {
      this.laneWidth = width;
    }

    addNewTrafficLight(laneGroup: Array<{section: number;id: number}>,
      time: number, specifiedYellowTime?: number): void {
      this.TLManager.addTrafficLight(laneGroup, time, specifiedYellowTime);
      // add TL id to lanes

      this.bindTrafficLight(this.TLManager
        .getTrafficLightQueue()[this.TLManager.getTrafficLightQueue().length - 1]);
    }

    addNewVehicle(laneId: number, sectionId: number, speed: number,
      vehicleId?: number, position?: Vec2): void {
      let vId = vehicleId;
      if (vId === undefined) {
        const str1 = Date.now().toString();
        const str2 = Math.round(Math.random() * 1000);
        vId = parseInt(`${str1}${str2}`, 10);
      }
      const objV = new Vehicle(vId, laneId, sectionId, speed, position);

      this.roadSections[this.getRoadSectionIndex(objV.getRoadSectionId())]
        .laneIn[objV.getLaneId()].addObjId(objV.getId());
      const laneFrom = this.getLane(laneId, sectionId);
      const lanePointer = laneFrom.getHeadLink();
      const laneTo = this.getLane(lanePointer[0].getLaneId(),
        lanePointer[0].getSectionId(), false);
      // safety dis
      const safetyDis = 35;

      objV.path.push([laneFrom.getTail(), laneFrom.getHead()]);
      objV.path.push([laneFrom.getHead(), laneTo.getTail()]);
      objV.path.push([laneTo.getTail(), laneTo.getHead()]);

      const dir = ts.tsNormalize(laneFrom.getHead().minus(laneFrom.getTail()));

      if (laneFrom.getObjIndex(objV.getId()) > 0) {
        const id = laneFrom.getObjects()[laneFrom.getObjIndex(objV.getId()) - 1];
        const frontV = this.getVehicle(id);
        const frontPos = frontV.getPosition().minus(dir.multiply(safetyDis));
        const dis1 = ts.tsLength(frontPos.minus(laneFrom.getHead()));
        const dis2 = ts.tsLength(laneFrom.getTail().minus(laneFrom.getHead()));
        if (dis1 < dis2) {
          objV.setPosition(laneFrom.getTail());
        } else {
          objV.setPosition(frontPos);
        }
      } else {
        objV.setPosition(laneFrom.getTail());
      }
      this.vehicles.push(objV);
      this.vehicleCount += 1;
    }

    addNewSimpleVehicle(vehicleId:number, position:Vec2) {
      const objV = new Vehicle(vehicleId,NaN,NaN,NaN,position);
      this.simpleVehicles.push(objV);
    }

    bindTrafficLight(trafficLight: TrafficLight): void {
      const toBeBound = trafficLight.getBoundLanes();
      for (let i = 0; i < toBeBound.length; i += 1) {
        const index = this.getRoadSectionIndex(toBeBound[i].section);
        this.roadSections[index].bindTrafficLightId(toBeBound[i].id, trafficLight.getId());
      }
    }

    forceTLState(id: number, state: string): void {
      this.TLManager.forceState(id, state);
    }

    deForceTLState(id: number): void {
      this.TLManager.deForceState(id);
    }

    updateLane(): Array<Array<Vec2>> {
      this.resortRoadSections();

      for (let i = 0; i < this.roadSections.length; i += 1) {
        this.roadSections[i].updateLanePosition(this.laneWidth);
      }

      const intersections = new Array<Array<Vec2>>();
      for (let i = 0; i < this.roadSections.length; i += 1) {
        // check left side
        const laneOut = this.roadSections[i]
          .getLaneAt(this.roadSections[i].laneOut.length - 1, false);
        const lineLeft = ts.line(laneOut.getHead(), laneOut.getTail());

        const laneIn = this.roadSections[i].getLaneAt(this.roadSections[i].laneIn.length - 1);
        const lineRight = ts.line(laneIn.getHead(), laneIn.getTail());

        const iLeft = (i - 1 + this.roadSections.length) % this.roadSections.length;
        const laneRightLSec = this.roadSections[iLeft]
          .getLaneAt(this.roadSections[iLeft].laneIn.length - 1);
        let edgeRightLSec = ts.line(laneRightLSec.getHead(), laneRightLSec.getTail());

        let laneDir = ts.tsNormalize(laneRightLSec.getHead().minus(laneRightLSec.getTail()));
        let perpendicularUnitVec = ts.tsRotateByOrigin(laneDir, Math.PI / 2);
        const offsetRightShift = perpendicularUnitVec.multiply(this.laneWidth * 0.5);

        const iRight = (i + 1 + this.roadSections.length) % this.roadSections.length;
        const laneLeftRSec = this.roadSections[iRight]
          .getLaneAt(this.roadSections[iRight].laneOut.length - 1, false);
        let edgeLeftRSec = ts.line(laneLeftRSec.getHead(), laneLeftRSec.getTail());


        laneDir = ts.tsNormalize(laneLeftRSec.getHead().minus(laneLeftRSec.getTail()));
        perpendicularUnitVec = ts.tsRotateByOrigin(laneDir, Math.PI / 2);
        const offsetLeftShift = perpendicularUnitVec.multiply(this.laneWidth * 0.5);
        // edge right
        edgeRightLSec = ts.lineShift(edgeRightLSec, offsetRightShift);
        // edge left
        edgeLeftRSec = ts.lineShift(edgeLeftRSec, offsetLeftShift);

        const intersectionLeft = ts.lineIntersection(lineLeft, edgeRightLSec);

        const intersectionRight = ts.lineIntersection(lineRight, edgeLeftRSec);

        intersections.push([intersectionLeft, intersectionRight]);

        this.roadSections[i].updateLaneWithOffset(intersectionLeft, intersectionRight);
      }
      return intersections;
    }

    resortRoadSections(): void {
      const resort = new Array<{index: number;angle: number}>();

      for (let i = 0; i < this.roadSections.length; i += 1) {
        const vec = this.roadSections[i].getTail().minus(this.roadSections[i].getHead());
        vec.y *= -1;
        let ang = ts.getAngleOfVec(vec) / Math.PI;
        ang *= 180;
        if (vec.x < 0) {
          ang += 180;
        }
        ang = (ang + 360) % 360;
        resort.push({ index: i, angle: ang });
      }

      for (let i = 0; i < resort.length - 1; i += 1) {
        let min = resort[i];
        for (let j = resort.length - 1; j > i; j -= 1) {
          if (min.angle > resort[j].angle) {
            min = resort[j];
            resort[j] = resort[i];
            resort[i] = min;
          }
        }
      }
      const roadSections = new Array<RoadSection>();

      for (let i = 0; i < resort.length; i += 1) {
        roadSections.push(this.roadSections[resort[i].index]);
      }

      this.roadSections = roadSections;
    }

    resortTrafficLightQueue(): void {
      const resort = new Array<number>();
      for (let i = 0; i < this.roadSections.length; i += 1) {
        for (let j = 0; j < this.roadSections[i].laneIn.length; j += 1) {
          let isExisted = false;
          for (let k = 0; k < resort.length; k += 1) {
            if (resort[k] === this.roadSections[i].getLaneAt(j).getTrafficLightId()) {
              isExisted = true;
            }
          }
          if (!isExisted) {
            resort.push(this.roadSections[i].getLaneAt(j).getTrafficLightId());
          }
        }
      }
      const sortedQueue = new Array<TrafficLight>();
      for (let i = 0; i < resort.length; i += 1) {
        sortedQueue.push(this.TLManager.getTrafficLight(resort[i]));
      }
      this.TLManager.setTrafficLightQueue(sortedQueue);
      this.TLManager.initialUpdate();
    }

    addNewRoadSection(tailVec2: Vec2): void {
      const roadSection = new RoadSection(this.roadSections.length, this.id, tailVec2);
      this.roadSections.push(roadSection);
    }

    addRoadSection(roadSection: RoadSection): void {
      this.roadSections.push(roadSection);
    }

    addNewLane(roadSectionId: number, laneDirection: number,
      laneType: string, numOfLanes: number): void {
      this.roadSections[roadSectionId].addNewLane(laneDirection, laneType, numOfLanes);
    }

    linkLanes(tail: LanePointer, head: LanePointer): void {
      this.roadSections[tail.getSectionId()].laneIn[tail.getLaneId()].addHeadLink(head);
      this.roadSections[head.getSectionId()].laneOut[head.getLaneId()].addTailLink(tail);

      // TODO
      // should we menually set road direction like straight turn left or right,
      // or make it auto adjusted when the lanes are linked to each other?
    }

    /**
     * tl couting down
     */
    tlCountingDown(): boolean {
      return this.TLManager.initialUpdate();
    }

    isForced(tlId: number): boolean {
      return this.TLManager.getTrafficLight(tlId).getIsForced();
    }

    isBlink(ratio?: number): boolean {
      return this.TLManager.isBlink(ratio);
    }

    updateVehiclePos(): void {
      for (let i = 0; i < this.vehicles.length; i += 1) {
        const vId = this.vehicles[i].getId();
        let frontV;
        if (this.vehicles[i].getAtPathSection() > 0 || this.getVehicleIndex(vId) <= 0) {
          frontV = undefined;
        } else {
          frontV = this.getFrontVehicle(vId);
        }
        if (frontV !== undefined) {
          this.vehicles[i].checkFront(frontV.getPosition(), 30, frontV.getSpeed());
        } else if (this.vehicles[i].getAtPathSection() === 0) {
          const sectionId = this.vehicles[i].getRoadSectionId();
          const laneId = this.vehicles[i].getLaneId();
          const tlId = this.roadSections[this.getRoadSectionIndex(sectionId)]
            .getLaneAt(laneId).getTrafficLightId();
          const tlState = this.getTrafficLightState(tlId);
          const tlCD = this.getTrafficLightCD(tlId);
          if (tlState === 'red' || (tlState === 'yellow' && tlCD < 3)) {
            this.vehicles[i].checkFront(this.getLane(laneId, sectionId).getHead(),
              16, 0);
          } else {
            this.vehicles[i].updateSpeed();
          }
        }
        this.vehicles[i].updatePosition(this.vehicles[i].getSpeed() * this.vehicles[i].getDeltaT());
      }
      this.checkTransitionVehicle();
      while (this.checkLeavingVehicle());
    }

    getFrontVehicle(id: number): Vehicle|undefined {
      const vehicle = this.getVehicle(id);

      const lane = this.getLane(vehicle.getLaneId(), vehicle.getRoadSectionId());
      const index = lane.getObjIndex(id);
      if (index <= 0) {
        return undefined;
      }
      const frontV = this.getVehicle(lane.getObjectIdByIndex(index - 1));
      return frontV;
    }

    vehicleGone(id: number, isLaneIn?: boolean): void {
      const vehicle = this.getVehicle(id);
      this.roadSections[this.getRoadSectionIndex(vehicle.getRoadSectionId())]
        .objGone(vehicle.getLaneId(), vehicle.getId(), isLaneIn);
      if (isLaneIn === false) {
        this.vehicles.splice(this.getVehicleIndex(id), 1);
      }
    }

    getVehicleIndex(id: number): number {
      for (let i = 0; i < this.vehicles.length; i += 1) {
        if (this.vehicles[i].getId() === id) {
          return i;
        }
      }
      return -1;
    }

    checkLeavingVehicle(): boolean {
      for (let i = 0; i < this.vehicles.length; i += 1) {
        if (this.vehicles[i].getIsGone()) {
          this.vehicleGone(this.vehicles[i].getId(), false);
          return true;
        }
      }
      return false;
    }

    checkTransitionVehicle(): void {
      for (let i = 0; i < this.vehicles.length; i += 1) {
        if (this.vehicles[i].getIsInTransition()) {
          if (this.vehicles[i].getAtPathSection() === 1) {
            let sectionId = this.vehicles[i].getRoadSectionId();
            let laneId = this.vehicles[i].getLaneId();
            const headLink = this.getLane(laneId, sectionId).getHeadLink();

            sectionId = headLink[0].getSectionId();
            laneId = headLink[0].getLaneId();

            // vehicle has to gone first from the section before update their now section and lane
            this.vehicleGone(this.vehicles[i].getId());

            this.vehicles[i].setRoadSectionId(sectionId);
            this.vehicles[i].setLaneId(laneId);
          }
          if (this.vehicles[i].getAtPathSection() === 2) {
            this.roadSections[this.getRoadSectionIndex(this.vehicles[i].getRoadSectionId())]
              .laneOut[this.vehicles[i].getLaneId()].addObjId(this.vehicles[i].getId());
          }
          this.vehicles[i].resetIsInTransition();
        }
      }
    }
}
