import RoadSection from './RoadSection';

/**
 * @class RoadIntersection
 */
export default class RoadIntersection {

    id:number;
    mapCoordinate:{x:number,y:number};
    roadSections:Array<RoadSection>;
    //TLManager:TrafficLightManager;

    constructor(id:number, mapCoordinate:{x:number,y:number})
    {
        this.id = id;
        this.mapCoordinate = mapCoordinate;
        this.roadSections = new Array<RoadSection>();
        //this.TLManager = new TLManager();
    }
}