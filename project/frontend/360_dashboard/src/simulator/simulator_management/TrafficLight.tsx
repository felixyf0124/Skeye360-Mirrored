/**
 * @class TrafficLight
 */
export default class TrafficLight {

    id:number;
    TLManagerId:number;
    countDownSetting:Array<number>;
    bindToLaneId:Array<number>;
    stateCountDown:number;

    constructor(id:number, TLManagerId:number){
        this.id = id;
        this.TLManagerId = TLManagerId;
        this.countDownSetting = new Array<number>();
        this.bindToLaneId = new Array<number>();
        this.stateCountDown = 0;
    }

    //Getters
    getTrafficLightId() {
        return this.id;
    }
    getTrafficLightManagerId() {
        return this.TLManagerId;
    }
    getCountDownSetting() {
        return this.countDownSetting;
    }
    getBindToLaneId() {
        return this.bindToLaneId;
    }
    getStateCountDown() {
        return this.stateCountDown;
    }
}

