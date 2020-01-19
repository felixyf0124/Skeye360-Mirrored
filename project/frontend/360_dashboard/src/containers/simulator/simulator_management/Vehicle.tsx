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

    speed:number;

    accel:number;

    decel:number;

    direction:vec2|undefined;

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
      this.speed = 0;
      this.accel = 0.8*this.maxSpeed;
      this.decel = 2.6*this.maxSpeed;
      this.direction = undefined;
    }

    /**
     * old function
     * check the front car
     * @param frontPostion 
     * @param safetyDistance 
     * @param targetSpeed 
     */
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

    /**
     * old function to update speed
     * @param targetSpeed 
     * @param acceleration 
     */
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

    // Getters
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

    /**
     * update position by speed disToTravel 
     * @param disToTravel 
     */
    updatePosition(disToTravel: number): void {
      const unitVec = ts.tsNormalize(
        this.path[this.atPathSection][this.atPath + 1].minus(this.position),
      );
      this.direction = unitVec;
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

    /**
     * set direction
     * @param dir 
     */
    setDirection(dir:vec2|undefined):void{
      this.direction = dir;
    }

    /**
     * update position v2
     * @param deltaTime 
     */
    update(deltaTime?:number){
      let deltaT = 1/60;
      if(deltaTime !== undefined){
        deltaT = deltaTime;
      }
      //acceleration
      if(this.state === 1) {
        if(this.speed <this.maxSpeed){
          this.speed += this.accel * deltaT;
          if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
          }
        }
      }else if(this.speed>0){//deceleration
        this.speed -= this.accel * deltaT;
        if(this.speed<0){
          this.speed = 0;
        }
      }

      // translate
      this.updatePosition(this.speed);
    }

    /**
     * signal move
     */
    move(){
      this.state = 1;
    }

    /**
     * signal stop
     */
    stop(){
      this.state = -1;
    }

    /**
     * R2 new function
     * check front obsticle 
     * if it is obsticle then return true
     * else return false
     * @param pos 
     * @param safetyDistance 
     */
    checkFrontObsticle(pos:vec2, safetyDistance:number, width:number):boolean{
      const distance = ts.tsLength(pos.minus(this.position));
      if(distance<safetyDistance){
        if(this.direction!==undefined) {
          const front = ts.tsNormalize(this.direction);
          const right = ts.tsRotateByOrigin(this.direction,-Math.PI/2);
          const poly = new Array<vec2>();
          poly.push(this.position
            .plus(front.multiply(safetyDistance)));
          poly.push(this.position
            .plus(front.multiply(0.8*safetyDistance))
            .plus(right.multiply(0.5*width)));
          poly.push(this.position
            .plus(right.multiply(0.5*width)));
          poly.push(this.position
            .plus(right.multiply(-0.5*width)));
          poly.push(this.position
            .plus(front.multiply(0.8*safetyDistance))
            .plus(right.multiply(-0.5*width)));
          if(ts.inside(pos,poly)){
            return true;
          }
        }
      }
      return false;
    }
}
