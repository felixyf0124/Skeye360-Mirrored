/**
 * @class Object
 */

import Vec2 from './vec2';

export default class Object {
    id: number;

    laneId: number;

    roadSectionId: number;

    position: Vec2;

    // State: move, stop
    state: number;

    speed: number;

    constructor(id: number, laneId: number, roadSectionId: number, speed: number, position?: Vec2) {
      this.id = id;
      this.position = position || new Vec2();
      this.laneId = laneId;
      this.roadSectionId = roadSectionId;
      this.state = 0;
      this.speed = speed;
    }

    // Getters
    getId(): number {
      return this.id;
    }

    getLaneId(): number {
      return this.laneId;
    }

    getRoadSectionId(): number {
      return this.roadSectionId;
    }

    getPosition(): Vec2 {
      return this.position;
    }

    getSpeed(): number {
      return this.speed;
    }

    // Setters
    setPosition(position: Vec2): void {
      this.position = position;
    }

    setLaneId(laneId: number): void {
      this.laneId = laneId;
    }

    setRoadSectionId(roadSectionId: number): void {
      this.roadSectionId = roadSectionId;
    }

    setState(state: number): void {
      this.state = state;
    }

    setObjectSpeed(speed: number): void {
      this.speed = speed;
    }
}
