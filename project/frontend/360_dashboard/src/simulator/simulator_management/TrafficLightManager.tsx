import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManager
 */
export default class TrafficLightManager {

    id:number;
    roadIntersection_id:number;
    trafficLightQueue: Array<TrafficLight>;
    countDown: number;
    countDownOffset: number;
    // trafficLight: TrafficLight;

    //TimePairs is an array of an array of numbers?
    //timePairs: Array<Array<number>>;
    startTime: number;
    timeOffset: number;
    //totalTimePeriod: number;
    deltaT: number;

    //constructor(roadIntersectionid:number, startTime:number, timeOffset:number);
    constructor(id:number, roadIntersectionid:number, startTime?:number, timeOffset?:number){
    //constructor(roadIntersectionid:number, allTrafficLightsAtIntersection?: Array<TrafficLight>, timePairs:Array<Array<number>>, startTime:number, timeOffset:number){
        this.id = id;
        this.roadIntersection_id = roadIntersectionid;
        this.trafficLightQueue = new Array<TrafficLight>();
        //this.allTrafficLightsAtIntersection = allTrafficLightsAtIntersection||new Array<TrafficLight>();
        this.countDown = 0;
        this.countDownOffset = 0;
        // this.trafficLight = new TrafficLight(0, 1);
        
        //this.timePairs = timePairs;
        this.startTime = startTime||Date.now();
        this.timeOffset = timeOffset||0;
        this.deltaT = 0;
        //this.totalTimePeriod = this.calculateTotalPeriodTime(this.timePairs.length);
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
    // getTimePairs(): Array<Array<number>> {
    //     return this.timePairs;
    // }
    getStartTime(): number {
        return this.startTime;
    }
    getTimeOffset(): number {
        return this.timeOffset;
    }
    // getTotalTimePeriod(): number {
    //     return this.totalTimePeriod;
    // }
    getDeltaT(): number {
        return this.deltaT
    }

    //Setters
    setCountDown(countDown: number) {
        this.countDown = countDown;
    }
    setCountDownOffset(countDownOffset: number) {
        this.countDownOffset = countDownOffset;
    }
    // setTimePairs(timePairs: Array<Array<number>>) {
    //     this.timePairs = timePairs;
    // }
    setStartTime(startTime: number) {
        this.startTime = startTime;
    }
    setTimeOffset(timeOffset: number) {
        this.timeOffset = timeOffset;
    }
    setDeltaT(deltaT: number) {
        this.deltaT = deltaT;
    }
    setAllTrafficLightsAsStop() {
        //This will set all traffic lights at a specific intersection as a red
        for(let index = 0; index < this.trafficLightQueue.length; index++) {
            this.trafficLightQueue[index].setTrafficLightStatus("red");
        }
    }
    setGreenLight(trafficLightId: number, timeGiven:number) {
        var lookup = this.trafficLightQueue.filter(function(trafficLight) {
            return trafficLight.id === trafficLightId;
        });

        //TODO:
        //Check for other traffic lights if its green

        //Check that lookup is not empty or undefined
        if(!lookup.length || !(lookup === undefined)) {
            lookup[0].setTrafficLightStatusCountDown(timeGiven);
            lookup[0].setTrafficLightStatus("green");
        }

    }
    setTrafficLightQueue(trafficLightsArray: Array<TrafficLight>) {
        this.trafficLightQueue = trafficLightsArray;
    }


    getTrafficLightState(id: number):string{
        const state:string = this.trafficLightQueue[id].getTrafficLightStatus();
        return state;
    }

}

