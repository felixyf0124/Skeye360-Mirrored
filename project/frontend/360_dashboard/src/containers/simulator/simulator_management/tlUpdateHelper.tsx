import IntSect from './RoadIntersection';

/**
 * update tl case for pedestrian
 * @param TStampData
 * @param intersection
 * @param forceHelper
 */
export function updateCasePedestrian(TStampData: {
  current: { ew: number; ns: number }; last: { ew: number; ns: number };
},
  intersection: IntSect,
  forceHelper: {
    startT: number; delay: number; fPeriod: number;
    isForced: boolean;
  }): void {
  if (TStampData.current !== undefined
    && TStampData.current.ew !== undefined
    && !Number.isNaN(TStampData.current.ew)
    && intersection !== undefined) {
    if (TStampData.current !== TStampData.last
    ) {
      // console.log(TStampData.current.ew+"|"+TStampData.current.ns);

      if ((TStampData.current.ew !== 0
        || TStampData.current.ns !== 0)
        && !forceHelper.isForced) {
        forceHelper.startT = Date.now();
        forceHelper.isForced = true;
        // console.log(forceHelper.startT);
        // console.log('Pedestrians are waiting, let them go first.');
      }

      TStampData.last = TStampData.current;
    }

    // update forced tl

    if (forceHelper.isForced) {
      const dTime = (Date.now() - forceHelper.startT) / 1000.0;
      // console.log(dTime);
      // console.log(forceHelper.delay);

      const tlQue = intersection.getTrafficLightQueue();

      if (dTime <= forceHelper.delay) {
        // state = 'yellow';
        for (let i = 0; i < tlQue.length; i += 1) {
          if (tlQue[i].getStatus() === 'red') {
            intersection.forceTLState(tlQue[i].getId(), 'red');
          } else if (tlQue[i].getStatus() === 'green') {
            intersection.forceTLState(tlQue[i].getId(), 'yellow');
          }
        }
      } else if (dTime <= forceHelper.delay + forceHelper.fPeriod) {
        // state = 'red';
        for (let i = 0; i < tlQue.length; i += 1) {
          if (tlQue[i].getStatus() === 'red') {
            intersection.forceTLState(tlQue[i].getId(), 'red');
          } else if (tlQue[i].getStatus() === 'green') {
            intersection.forceTLState(tlQue[i].getId(), 'red');
          } else if (tlQue[i].getStatus() === 'yellow') {
            intersection.forceTLState(tlQue[i].getId(), 'red');
          }
        }
      } else {
        // state = `N/A`;
        for (let i = 0; i < tlQue.length; i += 1) {
          intersection.deForceTLState(i);
        }
        forceHelper.isForced = false;
      }
    }
  }
}

/**
 * legacy
 * tl case update for real time
 * @param data
 * @param intersection
 */
export function updateCaseRealTime_Legacy(data: any, intersection: IntSect): void {
  // console.log(data);
  if (data !== undefined && intersection !== undefined) {
    let doUpdate = false;
    const tlQue = intersection.getTrafficLightQueue();
    const noRedTL = {
      id: NaN, cd: NaN, state: '', index: NaN,
    };
    for (let i = 0; i < tlQue.length; i += 1) {
      intersection.deForceTLState(i);
    }
    // find which tl now is not red
    for (let i = 0; i < tlQue.length; i += 1) {
      const id = tlQue[i].getId();
      if (id !== 2 && id !== 4) {
        if (tlQue[i].getStatus() === 'green'
          || tlQue[i].getStatus() === 'yellow') {
          noRedTL.id = id;
          noRedTL.cd = tlQue[i].getCountDown();
          noRedTL.state = tlQue[i].getStatus();
          noRedTL.index = i;
          break;
        }
      }
    }
    // counter at current counting time loop
    let counter = 0;
    for (let i = 0; i < noRedTL.index; i += 1) {
      const id = tlQue[i].getId();
      if (id !== 2 && id !== 4) {
        counter
          += tlQue[i].getTotalTime();
      }
    }
    if (noRedTL.state === 'green') {
      counter += (tlQue[noRedTL.index].getGreenTime()
        - noRedTL.cd);
    } else if (noRedTL.state === 'yellow') {
      counter += (tlQue[noRedTL.index].getTotalTime()
        - noRedTL.cd);
    }
    // let counterOffset = Date.now()-counter;
    for (let i = 0; i < data.length; i += 1) {
      if (noRedTL.id !== data[i].id) {
        const cSetting = intersection
          .getTrafficLightSetting(data[i].id);
        const totalT = cSetting.green + cSetting.yellow;
        if (totalT !== data[i].t) {
          doUpdate = true;
          // tl2 depends on tl0
          if (data[i].id === 0 && intersection.getTrafficLightState(2) !== 'red') {
            doUpdate = false;
          }
          // tl2 depends on tl1
          if (data[i].id === 1 && intersection.getTrafficLightState(2) !== 'red') {
            doUpdate = false;
          }
          // tl4 depends on tl1
          if (data[i].id === 1 && intersection.getTrafficLightState(4) !== 'red') {
            doUpdate = false;
          }

          // tl4 depends on tl3
          // if (data[i].id === 3 && intersection.getTrafficLightState(4) !== 'red') {
          //   doUpdate = false;
          // }
          if (doUpdate) {
            const index = intersection.getTrafficLightIndex(data[i].id);
            if (index < noRedTL.index) {
              counter += (data[i].t - totalT);
            }
            // console.log(data[i].id);
            intersection.setTrafficLightTime(data[i].id, data[i].t);
          }
        }
      }
    }

    // special update for overlap tl
    if (doUpdate) {
      // id 2 overlap with 0 & 1
      const id2 = 2;
      const totalT2 = intersection.getTrafficLight(0)
        .getTotalTime() + intersection.getTrafficLight(1)
          .getTotalTime();
      intersection.setTLOverlapOffset(id2, -totalT2);
      intersection.setTrafficLightTime(id2, totalT2);

      // id 4 overlap with 1 & 3
      const id4 = 4;
      const totalT4 = intersection.getTrafficLight(1)
        .getTotalTime() + intersection.getTrafficLight(3)
          .getTotalTime();
      intersection.setTLOverlapOffset(id4, -totalT4);
      intersection.setTrafficLightTime(id4, totalT4);

      // then update counter offset
      intersection
        .setTLCounterOffset(Date.now() - counter);
    }
  }
}

/**
 * new Version
 * tl case update for real time
 * @param data
 * @param intersection
 */
export function updateCaseRealTime(data: any, intersection: IntSect): void {
  // console.log(data);
  if (data !== undefined && intersection !== undefined) {
    let doUpdate = false;
    const seqIDs = [0, 1, 3];
    const tlQue = intersection.getTrafficLightQueue();
    const noRedTL = {
      id: NaN, cd: NaN, state: '', index: NaN,
    };
    for (let i = 0; i < tlQue.length; i += 1) {
      intersection.deForceTLState(i);
    }
    // find which tl now is not red
    for (let i = 0; i < seqIDs.length; i += 1) {
      const id = seqIDs[i];
      if (intersection.getTrafficLight(id).getStatus() === 'green'
        || intersection.getTrafficLight(id).getStatus() === 'yellow') {
        noRedTL.id = id;
        noRedTL.cd = intersection.getTrafficLight(id).getCountDown();
        noRedTL.state = intersection.getTrafficLight(id).getStatus();
        noRedTL.index = i;
        break;
      }
    }
    // counter at current counting time loop
    let counter = 0;
    for (let i = 0; i < noRedTL.index; i += 1) {
      const id = seqIDs[i];
      // if (id !== 2 && id !== 4) {
      counter
        += intersection.getTrafficLight(id).getTotalTime();
      // }
    }
    noRedTL.cd = intersection.getTrafficLight(noRedTL.index).getCountDown();
    if (noRedTL.state === 'green') {
      counter += (intersection.getTrafficLight(noRedTL.index).getGreenTime()
        - noRedTL.cd);
    } else if (noRedTL.state === 'yellow') {
      counter += (intersection.getTrafficLight(noRedTL.index).getTotalTime()
        - noRedTL.cd);
    }
    // let counterOffset = Date.now()-counter;
    for (let i = 0; i < data.length; i += 1) {
      if (noRedTL.id !== data[i].id) {
        const cSetting = intersection
          .getTrafficLightSetting(data[i].id);
        const totalT = cSetting.green + cSetting.yellow;
        doUpdate = true;
        // tl2 depends on tl0
        if (data[i].id === 0 && intersection.getTrafficLightState(2) !== 'red') {
          doUpdate = false;
        }
        // tl2 depends on tl1
        if (data[i].id === 1 && intersection.getTrafficLightState(2) !== 'red') {
          doUpdate = false;
        }
        // tl4 depends on tl1
        if (data[i].id === 1 && intersection.getTrafficLightState(4) !== 'red') {
          doUpdate = false;
        }

        // tl4 depends on tl3
        if (data[i].id === 3 && intersection.getTrafficLightState(4) !== 'red') {
          doUpdate = false;
        }
        if (doUpdate) {
          intersection.setTrafficLightTime(data[i].id, data[i].t);
        }
      }
    }

    // special update for overlap tl
    if (doUpdate) {
      // id 2 overlap with 0 & 1
      const id2 = 2;
      const totalT2 = intersection.getTrafficLight(0)
        .getTotalTime() + intersection.getTrafficLight(1)
          .getTotalTime();
      intersection.setTLOverlapOffset(id2, -totalT2);
      intersection.setTrafficLightTime(id2, totalT2);

      // id 4 overlap with 1 & 3
      const id4 = 4;
      const totalT4 = intersection.getTrafficLight(1)
        .getTotalTime() + intersection.getTrafficLight(3)
          .getTotalTime();
      intersection.setTLOverlapOffset(id4, -totalT4);
      intersection.setTrafficLightTime(id4, totalT4);

      // then update counter offset
      intersection
        .setTLCounterOffset(counter);
    }
  }
}

/**
 * tl case update for arima
 * @param tlDistribution
 * @param intersection
 */
export function updateCaseArima(tlDistribution: any, intersection: IntSect): void {
  if (intersection !== undefined) {
    const currentDistribution = {
      tl0: intersection.getTrafficLight(0).getTotalTime(),
      tl1: intersection.getTrafficLight(1).getTotalTime(),
      tl3: intersection.getTrafficLight(3).getTotalTime(),
    };

    if (currentDistribution !== tlDistribution) {
      const data0 = {
        id: 0,
        t: tlDistribution.tl0,
      };
      const data1 = {
        id: 1,
        t: tlDistribution.tl1,
      };
      const data3 = {
        id: 3,
        t: tlDistribution.tl3,
      };
      const dataPack = new Array<any>();
      dataPack.push(data0);
      dataPack.push(data1);
      dataPack.push(data3);

      updateCaseRealTime(dataPack, intersection);
    }
  }
}

/**
 * tl case update for combined optimized (arima + realtime)
 * @param tlDistribution
 * @param intersection
 */
export function updateCaseOptimized(tlDistribution: any, intersection: IntSect): void {
  updateCaseArima(tlDistribution, intersection);
}
