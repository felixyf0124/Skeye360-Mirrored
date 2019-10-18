// import React, {Component} from 'react'
//pixi.js-legacy for VM
// import * as PIXI from "pixi.js-legacy";
import Object from "./Object";
import * as ts from '../TSGeometry';
import Lane from "./Lane";
import Coordinate from "./Coordinate";

export default class vehicle extends Object{

    id:number;
    coordinateOffset: Coordinate;

    constructor(id:number, objectId:number, coordinate:Coordinate, lane_id:number, roadSection_id:number, speed:number) {
        super(objectId, coordinate, lane_id, roadSection_id, speed);
        this.id = id;
        this.coordinateOffset = new Coordinate();
    }

    //Getters
    private getVehicleId(): number {
        return this.id;
    }
    private getCoordinateOffset(): Coordinate {
        return this.coordinate;
    }

    //Setters
    private setCoordinateOffset(coordinateOffset: Coordinate) {
        this.coordinateOffset = coordinateOffset;
    }
}