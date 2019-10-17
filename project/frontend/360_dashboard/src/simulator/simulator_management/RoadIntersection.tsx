import RoadSection from './RoadSection';
import Coordinate from './Coordinate';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    // mapCoordinate:{x:number,y:number};
    mapCoordinate: Coordinate;
    roadSections:Array<RoadSection>;
    //TLManager:TrafficLightManager;

    constructor(id:number, mapCoordinate:Coordinate)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        //this.TLManager = new TLManager();
    }

    //Getters
    private getRoadIntersectionId() {
        return this.id;
    }
    private getMapCoordinate() {
        return this.mapCoordinate;
    }
    private getRoadSections() {
        return this.roadSections;
    }

    //Setters
    private setMapCoordinate(mapCoordinate: Coordinate) {
        this.mapCoordinate = mapCoordinate;
    }
}