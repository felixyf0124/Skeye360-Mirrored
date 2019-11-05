/**
 * @class TrafficLight
 */
export default class TrafficLight {
    id: number;

    TLManagerId: number;

    countDownSetting: Array<number>;

    bindToLaneId: Array<number>;

    trafficLightStatusCountDown: number;

    // TrafficLightStatus: stop (blinks red), red, yellow, green
    trafficLightStatus: string;

    constructor(id: number, TLManagerId: number) {
      this.id = id;
      this.TLManagerId = TLManagerId;
      this.countDownSetting = new Array<number>();
      this.bindToLaneId = new Array<number>();
      this.trafficLightStatusCountDown = 0;
      this.trafficLightStatus = 'stop';
    }

    // Getters
    getTrafficLightId(): number {
      return this.id;
    }

    getTrafficLightManagerId(): number {
      return this.TLManagerId;
    }

    getCountDownSetting(): Array<number> {
      return this.countDownSetting;
    }

    getBindToLaneId(): Array<number> {
      return this.bindToLaneId;
    }

    getStateCountDown(): number {
      return this.trafficLightStatusCountDown;
    }

    getTrafficLightStatus(): string {
      return this.trafficLightStatus;
    }

    // Setters
    setTrafficLightStatusCountDown(trafficLightStatusCountDown: number) {
      this.trafficLightStatusCountDown = trafficLightStatusCountDown;
    }

    setTrafficLightStatus(trafficLightStatus: string) {
      this.trafficLightStatus = trafficLightStatus;
    }
}
