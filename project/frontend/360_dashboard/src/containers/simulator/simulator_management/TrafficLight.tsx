// import { number } from "prop-types";

/**
 * @class TrafficLight
 */
export default class TrafficLight {
    id: number;

    countDownSetting: {green: number;yellow: number};

    boundLanes: Array<{section: number;id: number}>;

    status: string;

    isForced: boolean;

    overlapOffset: number;

    countDown: number;

    constructor(id: number) {
      this.id = id;
      this.countDownSetting = { green: 0, yellow: 0 };
      this.boundLanes = new Array<{section: number;id: number}>();
      this.status = 'red';
      this.isForced = false;
      this.overlapOffset = 0;
      this.countDown = NaN;
    }

    // Getters
    getId(): number {
      return this.id;
    }

    getCountDownSetting(): {green: number;yellow: number} {
      return this.countDownSetting;
    }

    getBoundLanes(): Array<{section: number;id: number}> {
      return this.boundLanes;
    }

    getStatus(): string {
      return this.status;
    }

    getGreenTime(): number {
      return this.countDownSetting.green;
    }

    getYellowTime(): number {
      return this.countDownSetting.yellow;
    }

    /**
     * total = green + yellow
     */
    getTotalTime(): number {
      const total = this.countDownSetting.green + this.countDownSetting.yellow;
      return total;
    }

    getIsForced(): boolean {
      return this.isForced;
    }

    getOverlapOffset(): number {
      return this.overlapOffset;
    }

    getCountDown(): number {
      return this.countDown;
    }

    // Setters
    setId(id: number): void {
      this.id = id;
    }

    /**
     * this auto defines
     * yellow = 5
     * green = totalTime - 5
     * totalTime should > 5
     * @param totalTime = 5 + green
     */
    setTotalTime(totalTime: number): void {
      try {
        if (totalTime <= 5) throw new Error('invalide total time coutdown setting \n  totalTime <= 5');
        this.countDownSetting = {
          green: totalTime - 5,
          yellow: 5,
        };
      } catch (e) {
        this.countDownSetting = {
          green: 10,
          yellow: 5,
        };
      }
    }

    setGreenTime(time: number): void {
      this.countDownSetting.green = time;
    }

    setYellowTime(time: number): void {
      this.countDownSetting.yellow = time;
    }

    setStatus(status: string): void {
      this.status = status;
    }

    setCountDown(countDown: number): void {
      this.countDown = countDown;
    }

    setIsForced(isForced: boolean, status?: string): void {
      this.isForced = isForced;
      if (status !== undefined) {
        this.status = status;
      }
    }

    setOverlapOffset(overlapOffset: number): void {
      this.overlapOffset = overlapOffset;
    }

    bindLane(lane: {section: number;id: number}): void {
      this.boundLanes.push(lane);
    }

    bindLanes(lanes: Array<{section: number;id: number}>): void {
      for (let i = 0; i < lanes.length; i += 1) {
        if (!this.isLaneBound(lanes[i])) {
          this.boundLanes.push(lanes[i]);
        }
      }
    }

    bindNewLaneGroup(laneGroup: Array<{section: number;id: number}>): void {
      this.boundLanes = laneGroup;
    }

    isLaneBound(lane: {section: number;id: number}): boolean {
      for (let i = 0; i < this.boundLanes.length; i += 1) {
        if (lane.section === this.boundLanes[i].section && lane.id === this.boundLanes[i].id) {
          return true;
        }
      }
      return false;
    }
}
