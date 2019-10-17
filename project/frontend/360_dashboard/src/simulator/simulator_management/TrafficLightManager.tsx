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
    private getTrafficLightManagerId() {
        return this.id;
    }
    private getRoadIntersectionId() {
        return this.roadIntersection_id;
    }
    private getTrafficLightQueue() {
        return this.trafficLightQueue;
    }
    private getCountDown() {
        return this.countDown;
    }
    private getCountDownOffset() {
        return this.countDownOffset;
    }

    //Setters
    private setCountDown(countDown: number) {
        this.countDown = countDown;
    }
    private setCountDownOffset(countDownOffset: number) {
        this.countDownOffset = countDownOffset;
    }
}

