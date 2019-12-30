// import React, {Component} from 'react'
// pixi.js-legacy for VM
// import * as PIXI from "pixi.js-legacy";
import Object from './SObject';
import * as ts from '../TSGeometry';
import vec2 from './vec2';

export default class Vehicle extends Object {
    path: Array<Array<vec2>>;

    traveled: number;

    atPathSection: number;

    atPath: number;

    isGone: boolean;

    isInTransition: boolean;

    lastTime: number;

    maxSpeed: number;

    constructor(id: number, laneId: number, roadSectionId: number,
      speed: number, position?: vec2) {
      super(id, laneId, roadSectionId, speed, position);
      this.path = new Array<Array<vec2>>();
      this.traveled = 0;
      this.atPathSection = 0;
      this.atPath = 0;
      this.isGone = false;
      this.isInTransition = false;
      this.lastTime = Date.now();
      this.maxSpeed = speed;
    }

    // Getters
    checkFront(frontPostion: vec2, safetyDistance: number, targetSpeed?: number): void {
      const distance = ts.tsLength(frontPostion.minus(this.position));
      let speed = targetSpeed;
      if (speed === undefined) {
        speed = 0;
      }
      if (distance < safetyDistance) {
        this.updateSpeed(speed);
      } else {
        this.updateSpeed();
      }
    }


    updateSpeed(targetSpeed?: number, acceleration?: number): void {
      let acce = acceleration;
      let speed = targetSpeed;
      if (acce === undefined) {
        acce = 0.3 * this.maxSpeed;
      }
      if (speed === undefined) {
        speed = this.maxSpeed;
      }

      if (this.speed < speed) {
        this.state = 1;
      } else if (this.speed > speed) {
        this.state = -1;
      } else {
        this.state = 0;
      }
      if (this.state === 1) {
        this.speed += acce;
        if (this.speed > speed) {
          this.speed = speed;
          this.state = 0;
        }
      }
      if (this.state === -1) {
        this.speed -= acce;
        if (this.speed < speed) {
          this.speed = speed;
          this.state = 0;
        }
      }
    }

    getPath(): Array<Array<vec2>> {
      return this.path;
    }

    getAtPath(): number {
      return this.atPath;
    }

    getAtPathSection(): number {
      return this.atPathSection;
    }

    getTraveled(): number {
      return this.traveled;
    }

    getIsGone(): boolean {
      return this.isGone;
    }

    getIsInTransition(): boolean {
      return this.isInTransition;
    }

    resetIsInTransition(): void {
      this.isInTransition = false;
    }

    updatePosition(disToTravel: number): void {
      const unitVec = ts.tsNormalize(
        this.path[this.atPathSection][this.atPath + 1].minus(this.position),
      );
      const lengthOfCurrentPath = this.getPathLength(this.atPathSection, this.atPath + 1);
      if (this.atPathSection === 0) {
        const disToTravelOfCurrentPath = ts.tsLength(this.position.minus(
          this.path[this.atPathSection][this.atPath + 1],
        ));
        if (disToTravelOfCurrentPath > lengthOfCurrentPath) {
          this.traveled = lengthOfCurrentPath - disToTravelOfCurrentPath;
        }
      }
      if (this.traveled + disToTravel < lengthOfCurrentPath) {
        this.position = this.position.plus(unitVec.multiply(disToTravel));
        this.traveled += disToTravel;
      } else {
        this.position = this.path[this.atPathSection][this.atPath + 1];
        this.atPath += 1;
        const leftOverDisToTravel = this.traveled + disToTravel - lengthOfCurrentPath;
        this.traveled = lengthOfCurrentPath;
        if (this.atPath === this.path[this.atPathSection].length - 1) {
          if (this.atPathSection + 1 === this.path.length) {
            this.isGone = true;
          } else {
            this.atPathSection += 1;
            this.atPath = 0;
            this.traveled = 0;
            this.isInTransition = true;
            this.updatePosition(leftOverDisToTravel);
          }
        } else {
          this.updatePosition(leftOverDisToTravel);
        }
      }
    }

    getDeltaT(): number {
      const currentTime = Date.now();
      const deltaT = currentTime - this.lastTime;
      this.lastTime = currentTime;
      return deltaT;
    }

    /**
     * till which index
     * @param index
     */
    getPathLength(pathSection: number, pathIndex?: number): number {
      let length = 0;
      const index = pathIndex || this.path[pathSection].length - 1;
      for (let i = 0; i < index; i += 1) {
        length += ts.tsLength(this.path[pathSection][i + 1].minus(this.path[pathSection][i]));
      }
      return length;
    }
}
