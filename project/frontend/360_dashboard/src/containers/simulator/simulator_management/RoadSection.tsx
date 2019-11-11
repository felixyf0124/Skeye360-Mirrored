import Lane from './Lane';
import Vec2 from './vec2';
import * as ts from '../TSGeometry';

/**
 * @class RoadSection
 */
export default class RoadSection {
    id: number;

    roadIntersectionId: number;

    head: Vec2;

    tail: Vec2;

    laneIn: Array<Lane>;

    laneOut: Array<Lane>;

    // tailCoordinate was tailCoordinate:{x:number,y:number} in the paramenter of the constructor
    constructor(id: number, roadIntersectionId: number, tailCoordinate: Vec2) {
      this.id = id;
      this.roadIntersectionId = roadIntersectionId;
      this.head = new Vec2();
      this.tail = tailCoordinate;
      this.laneIn = new Array<Lane>();
      this.laneOut = new Array<Lane>();
    }

    // Getters
    getId(): number {
      return this.id;
    }

    getRoadIntersectionId(): number {
      return this.roadIntersectionId;
    }

    getHead(): Vec2 {
      return this.head;
    }

    getTail(): Vec2 {
      return this.tail;
    }

    getLaneIn(): Array<Lane> {
      return this.laneIn;
    }

    getLaneOut(): Array<Lane> {
      return this.laneOut;
    }

    getLaneAt(id: number, isLaneIn?: boolean): Lane {
      if (isLaneIn === true || isLaneIn === undefined) {
        return this.laneIn[id];
      }
      return this.laneOut[id];
    }

    // Setters
    setId(id: number): void {
      this.id = id;
      for (let i = 0; i < this.laneIn.length; i += 1) {
        this.laneIn[i].setRoadSectionId(this.id);
      }
      for (let i = 0; i < this.laneOut.length; i += 1) {
        this.laneOut[i].setRoadSectionId(this.id);
      }
    }

    setHead(head: Vec2): void {
      this.head = head;
    }

    setTail(tail: Vec2): void {
      this.tail = tail;
    }


    bindTrafficLightId(laneInId: number, trafficLightId: number): void {
      this.laneIn[laneInId].bindTrafficLightId(trafficLightId);
    }

    addNewLane(laneDirection: number, laneType: string, numOfLanes: number): void {
      let id = 0;
      for (let i = 0; i < numOfLanes; i += 1) {
        if (laneDirection > 0) {
          id = this.laneIn.length;
          const lane = new Lane(id, laneType, laneDirection, this.id);
          lane.setHead(this.head);
          lane.setTail(this.tail);
          this.laneIn.push(lane);
        } else if (laneDirection < 0) {
          id = this.laneOut.length;
          const lane = new Lane(id, laneType, laneDirection, this.id);
          lane.setHead(this.tail);
          lane.setTail(this.head);
          this.laneOut.push(lane);
        } else {
          console.warn('invalid laneDirection input \n');
        }
      }
    }

    updateLanePosition(laneWidth: number): void {
      for (let i = 0; i < this.laneIn.length; i += 1) {
        const laneDirection = ts.tsNormalize(this.head.minus(this.tail));
        const perpendicularUnitVec = ts.tsRotateByOrigin(laneDirection, Math.PI / 2);

        const perpendicularOffset = perpendicularUnitVec.multiply((i + 0.5) * laneWidth);

        this.laneIn[i].setHead(this.head.plus(perpendicularOffset));
        this.laneIn[i].setTail(this.tail.plus(perpendicularOffset));
      }

      for (let i = 0; i < this.laneOut.length; i += 1) {
        const laneDirection = ts.tsNormalize(this.tail.minus(this.head));
        const perpendicularUnitVec = ts.tsRotateByOrigin(laneDirection, Math.PI / 2);

        const perpendicularOffset = perpendicularUnitVec.multiply((i + 0.5) * laneWidth);

        this.laneOut[i].setHead(this.tail.plus(perpendicularOffset));
        this.laneOut[i].setTail(this.head.plus(perpendicularOffset));
      }
    }

    updateLaneWithOffset(leftOffset: Vec2, rightOffset: Vec2): void {
      const offsetLine = ts.line(leftOffset, rightOffset);
      for (let i = 0; i < this.laneIn.length; i += 1) {
        const laneLine = ts.line(this.laneIn[i].getTail(), this.laneIn[i].getHead());
        const intersection = ts.lineIntersection(offsetLine, laneLine);
        this.laneIn[i].setHead(intersection);
      }

      for (let i = 0; i < this.laneOut.length; i += 1) {
        const laneLine = ts.line(this.laneOut[i].getTail(), this.laneOut[i].getHead());
        const intersection = ts.lineIntersection(offsetLine, laneLine);
        this.laneOut[i].setTail(intersection);
      }
    }

    offsetLanes(offset: Vec2): void {
      for (let i = 0; i < this.laneIn.length; i += 1) {
        this.laneIn[i].setHead(this.laneIn[i].getHead().plus(offset));
        this.laneIn[i].setTail(this.laneIn[i].getTail().plus(offset));
      }
      for (let i = 0; i < this.laneOut.length; i += 1) {
        this.laneOut[i].setHead(this.laneOut[i].getHead().plus(offset));
        this.laneOut[i].setTail(this.laneOut[i].getTail().plus(offset));
      }
    }

    objGone(laneId: number, objId: number, isLaneIn?: boolean): void {
      if (isLaneIn === true || isLaneIn === undefined) {
        this.laneIn[laneId].objGone(objId);
      } else {
        this.laneOut[laneId].objGone(objId);
      }
    }
}
