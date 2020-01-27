import IntSect from './RoadIntersection';
import RoadIntersection from './RoadIntersection';
// import { timingSafeEqual } from 'crypto';

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
    // console.log(data);
    let doUpdate = false;
    const tlQue = intersection.getTrafficLightQueue();
    let noRedTL = {id:NaN,cd:NaN,state:``,index:NaN};
    // find which tl now is not red
    for(let i=0;i<tlQue.length;i+=1){
        const id = tlQue[i].getId();
        if(id !==2 && id !== 4){
            if(tlQue[i].getStatus() === "green" 
            ||  tlQue[i].getStatus() === "yellow") {
                noRedTL.id = id;
                noRedTL.cd = tlQue[i].getCountDown();
                noRedTL.state = tlQue[i].getStatus();
                noRedTL.index = i;
                break;
            }
        }
        
    }
    //counter at current counting time loop
    let counter = 0;
    for(let i=0;i<noRedTL.index;i+=1){
        const id = tlQue[i].getId();
        if(id !==2 && id !== 4){
            counter += 
                tlQue[i].getTotalTime();
        }
    }
    if(noRedTL.state === "green"){
        counter += (tlQue[noRedTL.index].getGreenTime()
         -  noRedTL.cd);
    }else if (noRedTL.state === "yellow") {
        counter += (tlQue[noRedTL.index].getTotalTime()
         -  noRedTL.cd);
    }
    // let counterOffset = Date.now()-counter;
    for(let i=0;i<data.length;i+=1){
        if(noRedTL.id !== data[i].id) {
            const cSetting = intersection
                .getTrafficLightSetting(data[i].id);
            const totalT = cSetting.green + cSetting.yellow;
            if(totalT !== data[i].t) {
                doUpdate = true;
                const index= intersection.getTrafficLightIndex(data[i].id)
                if(index < noRedTL.index){
                    counter += (data[i].t - totalT);
                }
                console.log(data[i].id);
                intersection.setTrafficLightTime(data[i].id,data[i].t);
            }
        }
    }

    //special update for overlap tl
    if(doUpdate){
        //id 2 overlap with 0 & 1
        const id2= 2;
        const totalT2 = intersection.getTrafficLight(0)
            .getTotalTime() + intersection.getTrafficLight(1)
            .getTotalTime();
        intersection.setTLOverlapOffset(id2,-totalT2);
        intersection.setTrafficLightTime(id2,totalT2);

        //id 4 overlap with 1 & 3
        const id4= 4;
        const totalT4 = intersection.getTrafficLight(1)
            .getTotalTime() + intersection.getTrafficLight(3)
            .getTotalTime();
        intersection.setTLOverlapOffset(id4,-totalT4);
        intersection.setTrafficLightTime(id4,totalT4);
        
        //then update counter offset
        intersection
            .setTLCounterOffset(Date.now()-counter);
    }
    
    
}
