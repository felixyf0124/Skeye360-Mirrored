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

    // this array is for simple mapping vehicles
    simpleVehicles: Array<Vehicle>;

    vehicleCount: number;

    sectionAreas: Array<Array<Vec2>>;

    constructor(id: number, mapCoordinate: Vec2, TLManager?: TrafficLightManager) {
      this.id = id;
      this.mapCoordinate = mapCoordinate;
      this.roadSections = new Array<RoadSection>();
      this.TLManager = TLManager || new TrafficLightManager(id);
      this.laneWidth = 0;
      this.vehicles = new Array<Vehicle>();
      this.simpleVehicles = new Array<Vehicle>();
      this.vehicleCount = 0;
      this.sectionAreas = new Array<Array<Vec2>>();
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

    /**
     * set tl overlap offset
     * if tl overlaps with another tl either the ealier one (-) or later one (+)
     * @param id
     * @param overlapOffset
     */
    setTLOverlapOffset(id: number, overlapOffset: number): void{
      this.TLManager.setTrafficLightOverlapOffset(id, overlapOffset);
    }

    /**
     * old bug function
     * has been replaced by addNewVehicleV2
     * To be removed
     * add new vehicle
     * this is different from addNewSimpleVehicle
     * @param laneId
     * @param sectionId
     * @param speed
     * @param vehicleId
     * @param position
     */
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
      // const laneFrom = this.getLane(laneId, this.getRoadSectionIndex(sectionId));
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
      objV.setDirection(dir);
      if (laneFrom.getObjIndex(objV.getId()) > 0) {
        const id = laneFrom.getObjects()[laneFrom.getObjIndex(objV.getId()) - 1];
        // console.log(id);
        const frontV = this.getVehicle(id);
        // const frontPos = frontV.getPosition().minus(dir.multiply(safetyDis));
        const frontPos = frontV.getPosition();
        const frontToTravel = ts.tsLength(frontPos.minus(
          frontV.path[frontV.atPathSection][frontV.atPath + 1],
        ));


        // const dis1 = ts.tsLength(frontPos.minus(laneFrom.getHead()));
        const dis2 = ts.tsLength(laneFrom.getTail().minus(laneFrom.getHead()));
        if (frontToTravel + safetyDis < dis2) {
          objV.setPosition(laneFrom.getTail());
        } else {
          objV.setPosition(laneFrom.getTail());
          // objV.setPosition(frontPos.minus(dir.multiply(safetyDis)));
        }
      } else {
        objV.setPosition(laneFrom.getTail());
      }
      // console.log(objV.getPosition());
      this.vehicles.push(objV);
      this.vehicleCount += 1;
    }

    /**
     * R2 new funciton
     * add new vehicle
     * this is different from addNewSimpleVehicle
     * @param laneId
     * @param sectionId
     * @param speed
     * @param vehicleId
     * @param position
     */
    addNewVehicleV2(laneId: number, sectionId: number, speed: number,
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
      // const laneFrom = this.getLane(laneId, this.getRoadSectionIndex(sectionId));
      const laneFrom = this.getLane(laneId, sectionId);
      const lanePointer = laneFrom.getHeadLink();
      const laneTo = this.getLane(lanePointer[0].getLaneId(),
        lanePointer[0].getSectionId(), false);
      // safety dis
      const safetyDis = this.laneWidth * 1.1;
      const vWidth = this.laneWidth * 0.16;
      objV.path.push([laneFrom.getTail(), laneFrom.getHead()]);
      objV.path.push([laneFrom.getHead(), laneTo.getTail()]);
      objV.path.push([laneTo.getTail(), laneTo.getHead()]);

      const dir = ts.tsNormalize(laneFrom.getHead().minus(laneFrom.getTail()));
      objV.setDirection(dir);
      objV.setPosition(laneFrom.getTail());
      for (let j = 0; j < this.vehicles.length; j += 1) {
        if (objV.getId() !== this.vehicles[j].getId()) {
          if (objV.checkFrontNBackObsticle(
            this.vehicles[j].getPosition(), safetyDis, vWidth,
          )) {
            if (objV.checkFrontNBackObsticle(
              this.vehicles[j].getPosition(), safetyDis * 0.8, vWidth,
            )) {
              const currentPos = objV.getPosition();
              objV.setPosition(currentPos.minus(dir.multiply(0.9 * safetyDis)));
            }
          }
        }
      }
      this.vehicles.push(objV);
      this.vehicleCount += 1;
    }

    /**
     * add one new simpleVehicle
     * @param vehicleId
     * @param position
     */
    addNewSimpleVehicle(vehicleId: number, position: Vec2): void {
      const objV = new Vehicle(vehicleId, NaN, NaN, NaN, position);
      this.simpleVehicles.push(objV);
    }

    /**
     * initialize simpleVehicles
     */
    initSimpleVehicles(): void {
      this.simpleVehicles = new Array<Vehicle>();
    }

    /**
     * try to add new simple vehicle, if exists then update position
     * otherwise, add a new one
     * @param vehicleId
     * @param position
     */
    tryAddSimpleVehicle(vehicleId: number, position: Vec2): void {
      if (this.isSimpleVehicleExist(vehicleId)) {
        this.SimpleVehiclePosUpdate(vehicleId, position);
      } else {
        this.addNewSimpleVehicle(vehicleId, position);
      }
    }

    /**
     * check if vehicle at id @param id is already existed
     * @param id
     */
    isSimpleVehicleExist(id: number): boolean {
      for (let i = 0; i < this.simpleVehicles.length; i += 1) {
        if (this.simpleVehicles[i].getId() === id) {
          return true;
        }
      }
      return false;
    }

    /**
     * update simple vehicle position at @param id
     * @param id
     * @param pos
     */
    SimpleVehiclePosUpdate(id: number, pos: Vec2): void {
      for (let i = 0; i < this.simpleVehicles.length; i += 1) {
        if (this.simpleVehicles[i].getId() === id) {
          this.simpleVehicles[i].setPosition(pos);
        }
      }
    }

    /**
     * bind traffic light to associated road section and lanes
     * @param trafficLight
     */
    bindTrafficLight(trafficLight: TrafficLight): void {
      const toBeBound = trafficLight.getBoundLanes();
      for (let i = 0; i < toBeBound.length; i += 1) {
        const index = this.getRoadSectionIndex(toBeBound[i].section);
        this.roadSections[index].bindTrafficLightId(toBeBound[i].id, trafficLight.getId());
      }
    }

    /**
     * force tl at @param id to given @param state
     * @param id
     * @param state
     */
    forceTLState(id: number, state: string): void {
      this.TLManager.forceState(id, state);
    }

    /**
     * deforce tl at @param id back to normal state
     * @param id
     */
    deForceTLState(id: number): void {
      this.TLManager.deForceState(id);
    }

    /**
     * update lane
     * this will resort roadSections based on the clock angles of their direction
     */
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

    /**
     * resort roadsection sequence based on the (degree of) slops
     */
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

    /**
     * resort trafficlight queue based on the sequence
     */
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

    /**
     * add new road section with tail coordinate
     * @param tailVec2
     */
    addNewRoadSection(tailVec2: Vec2): void {
      const roadSection = new RoadSection(this.roadSections.length, this.id, tailVec2);
      this.roadSections.push(roadSection);
    }

    /**
     * add new road section to the list with a Roadsection object
     * @param roadSection
     */
    addRoadSection(roadSection: RoadSection): void {
      this.roadSections.push(roadSection);
    }

    /**
     * add new Lane
     * @param roadSectionId
     * @param laneDirection
     * @param laneType
     * @param numOfLanes
     */
    addNewLane(roadSectionId: number, laneDirection: number,
      laneType: string, numOfLanes: number): void {
      /**
         * since this function is called before road resort
         * the road section id is same as the index
         * this.roadSections[(roadSectionId)]
         * .addNewLane(laneDirection, laneType, numOfLanes);
         */

      this.roadSections[this.getRoadSectionIndex(roadSectionId)]
        .addNewLane(laneDirection, laneType, numOfLanes);
    }

    /**
     * link two lanes incoming(as a tail) -> outgoing(as a head)
     * @param tail
     * @param head
     */
    linkLanes(tail: LanePointer, head: LanePointer): void {
      // this.roadSections[tail.getSectionId()].laneIn[tail.getLaneId()].addHeadLink(head);
      // this.roadSections[head.getSectionId()].laneOut[head.getLaneId()].addTailLink(tail);
      this.roadSections[this.getRoadSectionIndex(tail.getSectionId())]
        .laneIn[tail.getLaneId()].addHeadLink(head);
      this.roadSections[this.getRoadSectionIndex(head.getSectionId())]
        .laneOut[head.getLaneId()].addTailLink(tail);

      // TODO
      // should we menually set road direction like straight turn left or right,
      // or make it auto adjusted when the lanes are linked to each other?
    }

    /**
     * link two lanes by 4 inputs
     * @param s1
     * @param l1
     * @param s2
     * @param l2
     */
    linkLanes4i(s1: number, l1: number, s2: number, l2: number): void {
      this.linkLanes(new LanePointer(s1, l1), new LanePointer(s2, l2));
    }

    /**
     * tl couting down
     */
    tlCountingDown(): boolean {
      return this.TLManager.initialUpdate();
    }

    /**
     * check if a traffic light is forced as some state
     * @param tlId
     */
    isForced(tlId: number): boolean {
      return this.TLManager.getTrafficLight(tlId).getIsForced();
    }

    /**
     * get traffic light on/off state based on @param ratio
     * @param ratio
     */
    isBlink(ratio?: number): boolean {
      return this.TLManager.isBlink(ratio);
    }

    /**
     * old function
     * to be removed
     * replaced by new improved function V2
     * update vehicles' positions
     * these vehicles are from the vehicles array not the simpleVehicles
     */
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

    /**
     * R2 new function
     * update vehicle posiiton with different algorithem
     * @param deltaT
     */
    updateVehiclePosV2(deltaT?: number): void{
      const safetyDis = this.laneWidth * 1.1;
      const vWidth = this.laneWidth * 0.3;
      for (let i = 0; i < this.vehicles.length; i += 1) {
        let go = true;
        for (let j = 0; j < this.vehicles.length; j += 1) {
          if (i !== j) {
            if (this.vehicles[i].checkFrontObsticle(
              this.vehicles[j].getPosition(), safetyDis, vWidth,
            )) {
              const targetSpeed = this.vehicles[j].getSpeed();
              const dis = ts.tsLength(this.vehicles[i].getPosition()
                .minus(this.vehicles[j].getPosition()));
              const mSpeed = targetSpeed * (dis / safetyDis);
              const mSpeed2 = this.vehicles[i].getTargetSpeed();
              if (mSpeed2 !== undefined) {
                this.vehicles[i].targetSpeed = Math
                  .min(mSpeed, mSpeed2);
              } else {
                this.vehicles[i].targetSpeed = mSpeed;
              }
              go = false;
            }
          }
        }

        // if(go === true){
        const sectionId = this.vehicles[i].getRoadSectionId();
        const laneId = this.vehicles[i].getLaneId();
        if (sectionId !== -1 && laneId !== -1) {
          const tlId = this.roadSections[this.getRoadSectionIndex(sectionId)]
            .getLaneAt(laneId).getTrafficLightId();
          const tlState = this.getTrafficLightState(tlId);
          const tlCD = this.getTrafficLightCD(tlId);
          if (tlState === 'red' || (tlState === 'yellow' && tlCD < 3)) {
            const stopLine = this.getLane(laneId, sectionId).getHead();

            if (this.vehicles[i]
              .checkFrontObsticle(stopLine, safetyDis, vWidth)) {
              go = false;
              this.vehicles[i].targetSpeed = undefined;
            }
          }
        } else {
          // console.log("unidefined section or lane id");
        }
        // }

        if (go) {
          this.vehicles[i].move();
        } else {
          this.vehicles[i].stop();
        }

        this.vehicles[i].update(deltaT);
      }
      // the following two function calls are very important
      this.checkTransitionVehicle();
      while (this.checkLeavingVehicle());
    }

    /**
     * get the front vehicle before the vehicle at @param id
     * in the same lane
     * @param id
     */
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

    /**
     * safely delete the vehicle & refresh the array
     * @param id
     * @param isLaneIn
     */
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
