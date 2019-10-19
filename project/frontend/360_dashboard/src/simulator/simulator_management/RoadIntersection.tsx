import RoadSection from './RoadSection';
import Coordinate from './Coordinate';
import TLManager from './TrafficLightManager';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    // mapCoordinate:{x:number,y:number};
    mapCoordinate: Coordinate;
    roadSections:Array<RoadSection>;
    TLManager:TLManager;

    constructor(id:number, mapCoordinate:Coordinate)
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        this.TLManager = new TLManager(id);
    }

    //Getters
    getRoadIntersectionId(): number {
        return this.id;
    }
    getMapCoordinate(): Coordinate {
        return this.mapCoordinate;
    }
    getRoadSections(): Array<RoadSection> {
        return this.roadSections;
    }

    //Setters
    setMapCoordinate(mapCoordinate: Coordinate) {
        this.mapCoordinate = mapCoordinate;
    }
}