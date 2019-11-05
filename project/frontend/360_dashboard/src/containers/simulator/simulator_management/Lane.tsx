import Coordinate from './vec2';
import LanePointer from './LanePointer';

/**
 * @class Lane
 */
export default class Lane {
    id: number;

    laneType: string;

    // 1 or -1 same or opposite with road section
    laneDirection: number;

    roadSectionId: number;

    objects: Array<number>;

    head: Coordinate;

    tail: Coordinate;

    headLinks: Array<LanePointer>;

    tailLinks: Array<LanePointer>;

    trafficLightId: number;

    constructor(id: number, laneType: string, laneDirection: number, roadSectionId: number) {
      this.id = id;
      this.laneType = laneType;
      this.laneDirection = laneDirection;
      this.roadSectionId = roadSectionId;
      this.objects = new Array<number>();
      this.head = new Coordinate();
      this.tail = new Coordinate();
      this.headLinks = new Array<LanePointer>();
      this.tailLinks = new Array<LanePointer>();
      this.trafficLightId = 0;
    }

    // Getters
    getId(): number {
      return this.id;
    }

    getLaneType(): string {
      return this.laneType;
    }

    getLaneDirection(): number {
      return this.laneDirection;
    }

    getRoadSectionId(): number {
      return this.roadSectionId;
    }

    getObjects(): Array<number> {
      return this.objects;
    }

    getObjectIdByIndex(index: number): number {
      return this.objects[index];
    }


    getHead(): Coordinate {
      return this.head;
    }

    getTail(): Coordinate {
      return this.tail;
    }

    getHeadLink(): Array<LanePointer> {
      return this.headLinks;
    }

    getTailLink(): Array<LanePointer> {
      return this.tailLinks;
    }

    getTrafficLightId(): number {
      return this.trafficLightId;
    }

    getObjIndex(id: number): number {
      for (let i = 0; i < this.objects.length; i += 1) {
        if (this.objects[i] === id) {
          const index = i;
          return index;
        }
      }
      return -1;
    }

    // Setters
    setId(id: number): void {
      this.id = id;
    }

    setLaneType(laneType: string): void {
      this.laneType = laneType;
    }

    setRoadSectionId(roadSectionId: number): void {
      this.roadSectionId = roadSectionId;
    }

    setHead(head: Coordinate): void {
      this.head = head;
    }

    setTail(tail: Coordinate): void {
      this.tail = tail;
    }

    bindTrafficLightId(id: number): void {
      this.trafficLightId = id;
    }

    addHeadLink(headLink: LanePointer): void {
      let isExisted = false;
      for (let i = 0; i < this.headLinks.length; i += 1) {
        if (this.headLinks[i].sectionId === headLink.sectionId
          && this.headLinks[i].laneId === headLink.laneId) {
          isExisted = true;
        }
      }
      if (!isExisted) {
        this.headLinks.push(headLink);
      }
    }

    addTailLink(tailLink: LanePointer): void {
      let isExisted = false;
      for (let i = 0; i < this.tailLinks.length; i += 1) {
        if (this.tailLinks[i].sectionId === tailLink.sectionId
                && this.tailLinks[i].laneId === tailLink.laneId) {
          isExisted = true;
        }
      }
      if (!isExisted) {
        this.tailLinks.push(tailLink);
      }
    }

    addObjId(objId: number): void {
      this.objects.push(objId);
    }

    clearHeadLinks(): void {
      this.headLinks = new Array<LanePointer>();
    }

    clearTailLinks(): void {
      this.tailLinks = new Array<LanePointer>();
    }

    objGone(id: number): void {
      this.objects.splice(this.getObjIndex(id), 1);
    }
}
