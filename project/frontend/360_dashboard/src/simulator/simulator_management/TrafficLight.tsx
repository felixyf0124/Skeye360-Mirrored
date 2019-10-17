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

    constructor(id:number, TLManagerId:number){
        this.id = id;
        this.TLManagerId = TLManagerId;
        this.countDownSetting = new Array<number>();
        this.bindToLaneId = new Array<number>();
        this.trafficLightStatusCountDown = 0;
        this.trafficLightStatus = "stop";
    }

    //Getters
    private getTrafficLightId() {
        return this.id;
    }
    private getTrafficLightManagerId() {
        return this.TLManagerId;
    }
    private getCountDownSetting() {
        return this.countDownSetting;
    }
    private getBindToLaneId() {
        return this.bindToLaneId;
    }
    private getStateCountDown() {
        return this.trafficLightStatusCountDown;
    }
    private getTrafficLightStatus() {
        return this.trafficLightStatus;
    }

    //Setters
    private setTrafficLightStatusCountDown(trafficLightStatusCountDown: number) {
        this.trafficLightStatusCountDown = trafficLightStatusCountDown;
    }
    private setTrafficLightStatus(trafficLightStatus: string) {
        this.trafficLightStatus = trafficLightStatus;
    }
}

