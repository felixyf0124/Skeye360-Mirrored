import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManager
 */
export default class TrafficLightManager {
    roadIntersectionId: number;

    trafficLightQueue: Array<TrafficLight>;

    countDown: number;

    startTime: number;

    timeOffset: number;

    deltaT: number;

    constructor(roadIntersectionId: number, timeOffset?: number) {
      this.roadIntersectionId = roadIntersectionId;
      this.trafficLightQueue = new Array<TrafficLight>();
      this.countDown = 0;
      this.startTime = Date.now();
      this.timeOffset = timeOffset || 0;
      this.deltaT = 0;
    }

    // Getters
    getRoadIntersectionId(): number {
      return this.roadIntersectionId;
    }

    getTrafficLightQueue(): Array<TrafficLight> {
      return this.trafficLightQueue;
    }

    /**
     * get by id, not array index
     * @param id
     */
    getTrafficLight(id: number): TrafficLight {
      return this.trafficLightQueue[this.getTrafficLightIndex(id)];
    }

    getTrafficLightState(id: number): string {
      const state: string = this.getTrafficLight(id).getStatus();
      return state;
    }

    getTrafficLightCD(id: number): number {
      const cd = this.getTrafficLight(id).getCountDown();
      return cd;
    }

    getTrafficLightIndex(id: number): number {
      try {
        for (let i = 0; i < this.trafficLightQueue.length; i += 1) {
          if (id === this.trafficLightQueue[i].getId()) {
            return i;
          }
        }
        throw new Error(`traffic light at id ${id} does not exist`);
      } catch (e) {
        return -1;
      }
    }

    getCountDown(): number {
      return this.countDown;
    }

    getStartTime(): number {
      return this.startTime;
    }

    getTimeOffset(): number {
      return this.timeOffset;
    }

    getDeltaT(): number {
      return this.deltaT;
    }

    getTimePeriod(): number {
      let period = 0;
      for (let i = 0; i < this.trafficLightQueue.length; i += 1) {
        // if the TL is not force to be a certain state then counted
        if (!this.trafficLightQueue[i].getIsForced()) {
          /**
                 * if overlap offset is less than total time
                 * it means this traffic light partially overlaps with others
                 * otherwise, fully overlaps with others
                 * so should not be counted
                 */
          if (this.trafficLightQueue[i].getOverlapOffset()
                < this.trafficLightQueue[i].getTotalTime()) {
            period += (this.trafficLightQueue[i].getTotalTime()
                    - Math.abs(this.trafficLightQueue[i].getOverlapOffset()));
          }
        }
      }
      return period;
    }

    // Setters
    setCountDown(countDown: number): void {
      this.countDown = countDown;
    }

    setStartTime(startTime: number): void {
      this.startTime = startTime;
    }

    setTimeOffset(timeOffset: number): void {
      this.timeOffset = timeOffset;
    }

    setDeltaT(deltaT: number): void {
      this.deltaT = deltaT;
    }

    setTrafficLightQueue(trafficLightsQueue: Array<TrafficLight>): void {
      this.trafficLightQueue = trafficLightsQueue;
    }

    forceState(id: number, state: string): void {
      this.trafficLightQueue[this.getTrafficLightIndex(id)].setIsForced(true);
      this.trafficLightQueue[this.getTrafficLightIndex(id)].setStatus(state);
    }

    deForceState(id: number): void {
      this.trafficLightQueue[this.getTrafficLightIndex(id)].setIsForced(false);
    }

    /**
     * add traffic light object to the traffic light queue
     * @param laneGroup
     * @param time in sec, can be green countdown time or total countdown of green and yellow
     * @param specifiedYellowTime can be undefined, default is 5 sec
     */
    addTrafficLight(laneGroup: Array<{section: number;id: number}>,
      time: number, specifiedYellowTime?: number): void {
      const trafficLight = new TrafficLight(this.getTrafficLightQueue().length);
      if (specifiedYellowTime === undefined) {
        trafficLight.setTotalTime(time);
      } else {
        trafficLight.setGreenTime(time);
        trafficLight.setYellowTime(specifiedYellowTime);
      }
      trafficLight.bindNewLaneGroup(laneGroup);
      this.trafficLightQueue.push(trafficLight);
    }

    setTrafficLightOverlapOffset(id: number, overlapOffset: number): void {
      for (let i = 0; i < this.trafficLightQueue.length; i += 1) {
        if (this.trafficLightQueue[i].getId() === id) {
          this.trafficLightQueue[i].setOverlapOffset(overlapOffset);
          break;
        }
      }
    }

    initialUpdate(): boolean {
      const total = this.getTimePeriod();
      this.deltaT = (Date.now() - this.startTime + this.timeOffset)
        / 1000;
      this.deltaT %= total;
      let addUp = 0;
      let isUpdating = false;
      let isSkip = false;
      for (let i = 0; i < this.trafficLightQueue.length; i += 1) {
        // skip current TL if it is forced set
        if (this.trafficLightQueue[i].getIsForced()) {
          this.trafficLightQueue[i].setCountDown(NaN);
          isUpdating = true;
          isSkip = true;
        }
        if (isSkip === false) {
          const addUpAfterOffset = (addUp + this.trafficLightQueue[i].getOverlapOffset()) % total;
          if (this.deltaT >= addUpAfterOffset
                  && this.deltaT < addUpAfterOffset + this.trafficLightQueue[i].getGreenTime()) {
            const countDown = (addUpAfterOffset
                        + this.trafficLightQueue[i].getGreenTime() - this.deltaT);
            this.trafficLightQueue[i].setCountDown(countDown);
            if (this.trafficLightQueue[i].getStatus() !== 'green') {
              this.trafficLightQueue[i].setStatus('green');
              isUpdating = true;
            }
          } else if (this.deltaT >= addUpAfterOffset + this.trafficLightQueue[i].getGreenTime()
                  && this.deltaT < addUpAfterOffset + this.trafficLightQueue[i].getGreenTime()
                  + this.trafficLightQueue[i].getYellowTime()) {
            const countDown = (addUpAfterOffset + this.trafficLightQueue[i].getGreenTime()
            + this.trafficLightQueue[i].getYellowTime() - this.deltaT);
            this.trafficLightQueue[i].setCountDown(countDown);
            if (this.trafficLightQueue[i].getStatus() !== 'yellow') {
              this.trafficLightQueue[i].setStatus('yellow');
              isUpdating = true;
            }
          } else {
            const countDown = (addUpAfterOffset + total - this.deltaT) % total;
            this.trafficLightQueue[i].setCountDown(countDown);
            if (this.trafficLightQueue[i].getStatus() !== 'red') {
              this.trafficLightQueue[i].setStatus('red');
              isUpdating = true;
            }
          }
          addUp += this.trafficLightQueue[i].getTotalTime();
        }
      }

      return isUpdating;
    }

    isBlink(ratio?: number): boolean {
      let rat = 0.5;

      if (ratio !== undefined) {
        rat = ratio;
      }

      if ((Date.now() - this.startTime) % 1000 > rat * 1000) {
        return true;
      }
      return false;
    }
}
