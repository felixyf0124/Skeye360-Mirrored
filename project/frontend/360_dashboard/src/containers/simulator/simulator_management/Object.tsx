/**
 * @class Object
 */

import Coordinate from './vec2';

export default class Object {
    id: number;

    lane_id: number;

    roadSection_id: number;

    coordinate: Coordinate;

    // State: move, stop
    state: string;

    speed: number;

    // roadIntersection_id:number;
    // state:string;
    // REPLACED BY COORDINATE CLASS
    // position:{
    //     x:number,y:number
    // };

    constructor(id: number, coordinate: Coordinate, lane_id: number, roadSection_id: number, speed: number) {
      this.id = id;
      this.coordinate = new Coordinate();
      this.lane_id = lane_id;
      this.roadSection_id = roadSection_id;
      this.state = 'stop';
      this.speed = speed;
    }

    // Getters
    getObjectId(): number {
      return this.id;
    }

    getLaneId(): number {
      return this.lane_id;
    }

    getRoadSectionId(): number {
      return this.roadSection_id;
    }

    getCoordinate(): Coordinate {
      return this.coordinate;
    }

    // Setters
    setCoordinate(coordinate: Coordinate) {
      this.coordinate = coordinate;
    }

    setLaneId(lane_id: number) {
      this.lane_id = lane_id;
    }

    setRoadSectionId(roadSection_id: number) {
      this.roadSection_id = roadSection_id;
    }

    setState(state: string) {
      this.state = state;
    }

    setObjectSpeed(speed: number) {
      this.speed = speed;
    }
}
