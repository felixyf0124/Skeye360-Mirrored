/**
 * @class TrafficLight
 */
export default class TrafficLight {

    id:number;
    TLManagerId:number;
    countDownSetting:Array<number>;
    bindToLaneId:Array<number>;
    trafficLightStatusCountDown:number;
    //TrafficLightStatus: stop (blinks red), red, yellow, green
    trafficLightStatus:string;

    //TimePairs is an array of an array of numbers?
    timePairs: Array<Array<number>>;
    startTime: number;
    timeOffset: number;
    totalTimePeriod: number;
    deltaT: number;



    constructor(id:number, TLManagerId:number, timePairs:Array<Array<number>>, startTime:number, timeOffset:number){
        this.id = id;
        this.TLManagerId = TLManagerId;
        this.countDownSetting = new Array<number>();
        this.bindToLaneId = new Array<number>();
        this.trafficLightStatusCountDown = 0;
        this.trafficLightStatus = "stop";
        this.timePairs = timePairs;
        this.startTime = startTime;
        this.timeOffset = timeOffset;
        this.deltaT = 0;
        this.totalTimePeriod = this.calculateTotalPeriodTime(this.timePairs.length);
    }

    //Getters
    private getTrafficLightId(): number {
        return this.id;
    }
    private getTrafficLightManagerId(): number {
        return this.TLManagerId;
    }
    private getCountDownSetting(): Array<number> {
        return this.countDownSetting;
    }
    private getBindToLaneId(): Array<number> {
        return this.bindToLaneId;
    }
    private getStateCountDown(): number {
        return this.trafficLightStatusCountDown;
    }
    private getTrafficLightStatus(): string {
        return this.trafficLightStatus;
    }
    private getTimePairs(): Array<Array<number>> {
        return this.timePairs;
    }
    private getStartTime(): number {
        return this.startTime;
    }
    private getTimeOffset(): number {
        return this.timeOffset;
    }
    private getTotalTimePeriod(): number {
        return this.totalTimePeriod;
    }
    private getDeltaT(): number {
        return this.deltaT
    }

    //Setters
    private setTrafficLightStatusCountDown(trafficLightStatusCountDown: number) {
        this.trafficLightStatusCountDown = trafficLightStatusCountDown;
    }
    private setTrafficLightStatus(trafficLightStatus: string) {
        this.trafficLightStatus = trafficLightStatus;
    }
    private setTimePairs(timePairs: Array<Array<number>>) {
        this.timePairs = timePairs;
    }
    private setStartTime(startTime: number) {
        this.startTime = startTime;
    }
    private setTimeOffset(timeOffset: number) {
        this.timeOffset = timeOffset;
    }
    private setDeltaT(deltaT: number) {
        this.deltaT = deltaT;
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

