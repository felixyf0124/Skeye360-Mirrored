import IntSect from './RoadIntersection';
import RoadIntersection from './RoadIntersection';

export async function updateCasePedestrian(TStampData: {
    current: {ew: number; ns: number}; last: {ew: number; ns: number};},
intersection: IntSect,
forceHelper: {startT: number;delay: number; fPeriod: number;
     isForced: boolean;}) {
  if (TStampData.current !== undefined
        && TStampData.current.ew !== undefined
        && !Number.isNaN(TStampData.current.ew)) {
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


export function updateCaseRealTime(data:any, intersection:RoadIntersection) {
    console.log(data);
    // const doUpdate = false;
    // const tlQue = intersection.getTrafficLightQueue();
    // let noRedId = -1;
    // find which tl now is not red
    // for(let i=0;i<tlQue.length;i+=1){
    //     const id = tlQue[i].getId();
    //     if(id !==2 && id !== 4){
    //         if(tlQue[i].getStatus() === "green" 
    //         ||  tlQue[i].getStatus() === "yellow") {
    //             noRedId = id;
    //             break;
    //         }
    //     }
        
    // }
}
