import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManger
 */
export default class TrafficLightManger {

    id:number;
    roadIntersection_id:number;
    trafficLightQueue: Array<TrafficLight>;
    countDown: number;
    countDownOffset: number;

    constructor(id:number, roadIntersectionid:number){
        this.id = id;
        this.roadIntersection_id = roadIntersectionid;
        this.trafficLightQueue = new Array<TrafficLight>();
        this.countDown = 0;
        this.countDownOffset = 0;
    }

    //Getters
    getTrafficLightManagerId() {
        return this.id;
    }
    getRoadIntersectionId() {
        return this.roadIntersection_id;
    }
    getTrafficLightQueue() {
        return this.trafficLightQueue;
    }
    getCountDown() {
        return this.countDown;
    }
    getCountDownOffset() {
        return this.countDownOffset;
    }
}

