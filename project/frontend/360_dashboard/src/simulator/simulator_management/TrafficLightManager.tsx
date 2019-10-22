import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManager
 */
export default class TrafficLightManager {

    //id:number;
    roadIntersection_id:number;
    trafficLightQueue: Array<TrafficLight>;
    allTrafficLightsAtIntersection: Array<TrafficLight>;
    countDown: number;
    countDownOffset: number;
    // trafficLight: TrafficLight;

    //TimePairs is an array of an array of numbers?
    timePairs: Array<Array<number>>;
    startTime: number;
    timeOffset: number;
    totalTimePeriod: number;
    deltaT: number;

    constructor(roadIntersectionid:number, allTrafficLightsAtIntersection: Array<TrafficLight>, timePairs:Array<Array<number>>, startTime:number, timeOffset:number){
        //this.id = id;
        this.roadIntersection_id = roadIntersectionid;
        this.trafficLightQueue = new Array<TrafficLight>();
        this.allTrafficLightsAtIntersection = allTrafficLightsAtIntersection;
        this.countDown = 0;
        this.countDownOffset = 0;
        // this.trafficLight = new TrafficLight(0, 1);
        
        this.timePairs = timePairs;
        this.startTime = startTime;
        this.timeOffset = timeOffset;
        this.deltaT = 0;
        this.totalTimePeriod = this.calculateTotalPeriodTime(this.timePairs.length);
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
    getTimePairs(): Array<Array<number>> {
        return this.timePairs;
    }
    getStartTime(): number {
        return this.startTime;
    }
    getTimeOffset(): number {
        return this.timeOffset;
    }
    getTotalTimePeriod(): number {
        return this.totalTimePeriod;
    }
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
    setTimePairs(timePairs: Array<Array<number>>) {
        this.timePairs = timePairs;
    }
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
        //This will set all traffic lights at a specific intersection as a stop sign (blinks red)
        for(let index = 0; index < this.allTrafficLightsAtIntersection.length; index++) {
            this.allTrafficLightsAtIntersection[index].setTrafficLightStatus("stop");
        }
    }
    setGreenLight(trafficLightId: number, timeGiven:number) {
        var lookup = this.allTrafficLightsAtIntersection.filter(function(trafficLight) {
            return trafficLight.id === trafficLightId;
        });
        //TODO: 
        //Make it green for specific traffic light for a given time

    }


    calculateTotalPeriodTime(index: number): number {
        var totalTime:number = 0;
        for(let i = 0; i < index; i++) {
            totalTime += this.timePairs[i][0];
            totalTime += this.timePairs[i][1];
        }
        return totalTime;
    }

    getTrafficLightStateAtDirection(index: number) {
        this.deltaT = Date.now()-(this.startTime + this.timeOffset);
        const greenTimeStart:number = this.getGreenTimeStartOffset(index);
        const yellowTimeStart:number = this.getYellowTimeStartOffset(index);
        const redTimeStart:number = this.getRedTimeStartOffset(index);
        const tempT = this.deltaT%(this.totalTimePeriod*1000);
        var currentLightCountDown: number = 0;

        //To refactor later on with Handler or Polymorphism
        if(tempT < yellowTimeStart*1000 && tempT >= greenTimeStart*1000) {
            currentLightCountDown = this.timePairs[index][0] - (tempT/1000 - greenTimeStart)+1;
            return [1,currentLightCountDown];
        } else if(tempT<redTimeStart*1000 && tempT>=yellowTimeStart*1000) {
            currentLightCountDown = this.timePairs[index][1] - (tempT/1000 - yellowTimeStart)+1;
            return [2,currentLightCountDown];
        } else {
            currentLightCountDown = (this.timePairs[(index-1+this.timePairs.length)%this.timePairs.length][0] + 
                                    this.timePairs[(index-1+this.timePairs.length)%this.timePairs.length][1])
                                    - (tempT/1000 - redTimeStart%this.totalTimePeriod)+1;
            return [3,currentLightCountDown];
        }
    }

    getGreenTimeStartOffset(index: number){
        return this.calculateTotalPeriodTime(index);
    }

    getYellowTimeStartOffset(index: number){
        var orangeTimeStart:number = this.getGreenTimeStartOffset(index) + this.timePairs[index][0];
        return orangeTimeStart;
    }

    getRedTimeStartOffset(index: number){
        var redTimeStart:number = this.getYellowTimeStartOffset(index) + this.timePairs[index][1];
        return redTimeStart;
    }
}

