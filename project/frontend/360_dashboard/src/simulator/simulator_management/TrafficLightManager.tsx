import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManger
 */
export default class TrafficLightManger {

    //id:number;
    roadIntersection_id:number;
    trafficLightQueue: Array<TrafficLight>;
    countDown: number;
    countDownOffset: number;

    constructor(roadIntersectionid:number){
        //this.id = id;
        this.roadIntersection_id = roadIntersectionid;
        this.trafficLightQueue = new Array<TrafficLight>();
        this.countDown = 0;
        this.countDownOffset = 0;
    }

    //Getters
    // private getTrafficLightManagerId(): number {
    //     return this.id;
    // }
    getRoadIntersectionId(): number {
        return this.roadIntersection_id;
    }
    getTrafficLightQueue(): Array<TrafficLight> {
        return this.trafficLightQueue;
    }
    getCountDown(): number {
        return this.countDown;
    }
    getCountDownOffset(): number {
        return this.countDownOffset;
    }

    //Setters
    setCountDown(countDown: number) {
        this.countDown = countDown;
    }
    setCountDownOffset(countDownOffset: number) {
        this.countDownOffset = countDownOffset;
    }
}

