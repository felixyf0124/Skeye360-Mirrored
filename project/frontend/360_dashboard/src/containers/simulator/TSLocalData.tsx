import * as d3 from 'd3';
// import { stringify } from 'querystring';
import Vec2 from './simulator_management/vec2';
import LanePointer from './simulator_management/LanePointer';


/**
 * get lane areas in form of Array<Array<Vec2>>
 *
 * hard coded data
 */
export function loadSectionAreas(): Array<Array<Vec2>> {
  const sectionAreas = new Array<Array<Vec2>>();
  const sectionArea1 = new Array<Vec2>();
  const sectionArea2 = new Array<Vec2>();
  const sectionArea3 = new Array<Vec2>();
  const sectionArea4 = new Array<Vec2>();

  // south
  sectionArea1.push(new Vec2(0.32044198895027626, 0.8322017458777885));
  sectionArea1.push(new Vec2(0.4718232044198895, 0.9194956353055286));
  sectionArea1.push(new Vec2(0.44419889502762433, 1.0));
  sectionArea1.push(new Vec2(0.22430939226519336, 1.0));

  // west
  sectionArea2.push(new Vec2(0.2883977900552486, 0.4073714839961203));
  sectionArea2.push(new Vec2(0.2165745856353591, 0.49078564500484967));
  sectionArea2.push(new Vec2(0.0, 0.41125121241513096));
  sectionArea2.push(new Vec2(0.0, 0.3375363724539282));

  // north
  sectionArea3.push(new Vec2(0.6408839779005525, 0.3123181377303589));
  sectionArea3.push(new Vec2(0.5767955801104973, 0.2987390882638215));
  sectionArea3.push(new Vec2(0.5904025795061979, 0.21486115236115236));
  sectionArea3.push(new Vec2(0.5900552486187846, 0.11251212415130941));
  sectionArea3.push(new Vec2(0.6696132596685083, 0.09311348205625607));
  sectionArea3.push(new Vec2(0.6983425414364641, 0.18040737148399613));

  // east
  sectionArea4.push(new Vec2(0.8121546961325967, 0.5295829291949563));
  sectionArea4.push(new Vec2(0.8154696132596685, 0.4190106692531523));
  sectionArea4.push(new Vec2(1.0, 0.469447138700291));
  sectionArea4.push(new Vec2(1.0, 0.5722599418040737));


  sectionAreas.push(sectionArea3);
  sectionAreas.push(sectionArea2);
  sectionAreas.push(sectionArea1);
  sectionAreas.push(sectionArea4);

  return sectionAreas;
}

/**
 * get lane areas in form of Array<Array<Vec2>>
 *
 * hard coded data for new intersection
 */
export function loadSectionAreas2(): Array<Array<Vec2>> {
  const sectionAreas = new Array<Array<Vec2>>();
  const sectionArea1 = new Array<Vec2>();
  const sectionArea2 = new Array<Vec2>();
  const sectionArea3 = new Array<Vec2>();
  const sectionArea4 = new Array<Vec2>();

  // south
  sectionArea1.push(new Vec2(0.7496560312097252, 0.7842859627687556));
  sectionArea1.push(new Vec2(0.7975504197290049, 0.7265894126830593));
  sectionArea1.push(new Vec2(1.0, 0.8820125320300701));
  sectionArea1.push(new Vec2(1.0, 1.0));

  // west
  sectionArea2.push(new Vec2(0.12354575220314189, 0.6570141611091314));
  sectionArea2.push(new Vec2(0.14792834999477517, 0.7486498583040608));
  sectionArea2.push(new Vec2(0.0, 0.8097403231006806));
  sectionArea2.push(new Vec2(0.0, 0.7147107111948278));

  // north
  sectionArea3.push(new Vec2(0.311640078024313, 0.4007736004344211));
  sectionArea3.push(new Vec2(0.23326744226549168, 0.42962187547726927));
  sectionArea3.push(new Vec2(0.1305122087150371, 0.2701078840638735));
  sectionArea3.push(new Vec2(0.16795691246647393, 0.25822918257564187));

  // east
  sectionArea4.push(new Vec2(0.6608337106830611, 0.42622796076634595));
  sectionArea4.push(new Vec2(0.6303554634435196, 0.4024705577898828));
  sectionArea4.push(new Vec2(0.9299130934550142, 0.2819865855521051));
  sectionArea4.push(new Vec2(0.9638745689505034, 0.29725920175126));


  sectionAreas.push(sectionArea3);
  sectionAreas.push(sectionArea2);
  sectionAreas.push(sectionArea1);
  sectionAreas.push(sectionArea4);

  return sectionAreas;
}

/**
 * load csv  data
 * @param path
 */
export function loadCarGenData(path: any): Array<any> {
  const array = new Array<{
    id: number;
    tLine: number;
    from: string;
    to: string;
  }>();

  d3.csv(path, (d: any) => {
    //  console.log(d);
    const strTime = d.time;

    const tLineFormat = /\d+(\.\d+)?/g;
    const matchesArray = strTime.match(tLineFormat);
    let tt = 0;
    if (matchesArray != null) {
      const h = parseInt(matchesArray[0], 10);
      const m = parseInt(matchesArray[1], 10);
      // centi-second
      const s = parseInt(matchesArray[2], 10);
      // console.log(m+"|"+s+"|"+ms);
      tt = (((h * 60) + m) * 60 + s);
    }
    const tLine = tt * 1000;
    const row = {
      id: d.id,
      tLine,
      from: d.from,
      to: d.to,
    };
    array.push(row);

    return row;
  });

  const obj = array;

  return obj;
}

/**
 * sort csv data based on timeLine @param tLine
 * @param unsorted
 */
export function sortDataByTime(unsorted: Array<any>): void {
  unsorted.sort((a: any, b: any) => a.tLine - b.tLine);
}

/**
 * adapter adapt string direction to @type LanePointer
 * based on current setting
 * @param from
 * @param to
 */
export function dirAdapter(from: string, to: string): LanePointer {
  const lPointer = new LanePointer();
  // from est
  if (from.includes('east')) {
    lPointer.setSectionId(0);
    // to
    if (to.includes('east')) {
      lPointer.setLaneId(0);
    }
    if (to.includes('south')) {
      lPointer.setLaneId(1);
    }
    if (to.includes('west')) {
      lPointer.setLaneId(2);
    }
    if (to.includes('north')) {
      lPointer.setLaneId(3);
    }
  }
  // from west
  if (from.includes('west')) {
    lPointer.setSectionId(1);
    // to
    if (to.includes('west')) {
      lPointer.setLaneId(0);
    }
    if (to.includes('north')) {
      lPointer.setLaneId(1);
    }
    if (to.includes('east')) {
      lPointer.setLaneId(2);
    }
    if (to.includes('south')) {
      lPointer.setLaneId(3);
    }
  }
  // from south
  if (from.includes('south')) {
    lPointer.setSectionId(2);
    // to
    if (to.includes('south')) {
      lPointer.setLaneId(0);
    }
    if (to.includes('west')) {
      lPointer.setLaneId(1);
    }
    if (to.includes('north')) {
      lPointer.setLaneId(2);
    }
    if (to.includes('east')) {
      lPointer.setLaneId(3);
    }
  }

  // from north
  if (from.includes('north')) {
    lPointer.setSectionId(3);
    // to
    if (to.includes('north')) {
      // lPointer.setLaneId(0);
      // console.log('N to N, not match video condition');
    }
    if (to.includes('east')) {
      lPointer.setLaneId(0);
    }
    if (to.includes('south')) {
      lPointer.setLaneId(1);
    }
    if (to.includes('west')) {
      lPointer.setLaneId(2);
    }
  }

  return lPointer;
}


/**
 * R2 new url retrieve function
 * @param url
 * @param endP
 */
export async function retrieve(url: string, endP: string, filter?: string): Promise<any> {
  let filterValue = '';
  if (filter !== undefined) {
    filterValue = filter;
  }
  const result = await
  fetch(`http://${url}/${endP}/${filterValue}`)
    .then((response) => response.json())
  // .then(result => console.log(result))
    .catch((error) => `ERROR:${error}`);
  // .catch((error) => console.log('error', error));
  // console.log(result);
  return result;
}

/**
 * specific retrieve function for tl timing of pedestrian case
 * @param url
 */
export async function tlPedestrianData(url: string): Promise<any> {
  const data = await retrieve(url, 'lights');

  return data;
}

/**
 * specific retrieve function for tl timing of real-time case
 * @param url
 */
export async function tlRealTimeData(url: string): Promise<any> {
  const data = await retrieve(url, 'timers', '');
  return data;
}

/**
 * adapter for arima data
 * @param filtered
 */
export function tlArimaDataAdapter(filtered: any): Array<any> {
  const adapted = new Array<any>();
  const tl0 = { id: 0, count: 0 };
  const tl1 = { id: 1, count: 0 };
  const tl3 = { id: 3, count: 0 };
  for (let i = 0; i < filtered.length; i += 1) {
    // tl id 0
    // e->w
    // w->s
    if (filtered[i].dir === 'ew'
      || filtered[i].dir === 'we') {
      tl0.count += filtered[i].count;
    }

    // tl id 1
    // e->e e->s
    // w->w w->n
    if (filtered[i].dir === 'ee'
      || filtered[i].dir === 'es'
      || filtered[i].dir === 'ww'
      || filtered[i].dir === 'wn') {
      tl1.count += filtered[i].count;
    }

    // tl id 3
    // s->w s->n s->s
    // n->e n->s n->w
    if (filtered[i].dir === 'sw'
      || filtered[i].dir === 'sn'
      || filtered[i].dir === 'ss'
      || filtered[i].dir === 'ne'
      || filtered[i].dir === 'ns'
      || filtered[i].dir === 'nw') {
      tl3.count += filtered[i].count;
    }
  }

  adapted.push(tl0);
  adapted.push(tl1);
  adapted.push(tl3);

  return adapted;
}

/**
 * calculate tl distribution based on the adapeted data
 * @param adaptedData
 */
export function tlArimaDataToTimeDistribution(adaptedData: any): any {
  // total time period = 90s
  const tTime = 90.0;
  let tCount = 0;
  for (let i = 0; i < adaptedData.length; i += 1) {
    tCount += adaptedData[i].count;
  }
  // console.log(tCount);
  const tl0 = tTime
    * (adaptedData[0].count / tCount);

  const tl1 = tTime
    * (adaptedData[1].count / tCount);

  const tl3 = tTime
    * (adaptedData[2].count / tCount);

  const tlTDistrib = { tl0, tl1, tl3 };
  return tlTDistrib;
}


/**
 * specific retrieve function for tl timing of arima case
 * @param url
 */
export async function tlArimaData(url: string): Promise<any> {
  // console.log(new Date().toString());
  let currentH = new Date().getHours().toString();
  const currentY = new Date().getFullYear().toString();
  let currentM = (new Date().getMonth() + 1).toString();
  let currentDate = new Date().getDate().toString();

  if (currentH.length === 1) {
    currentH = `0${currentH}`;
  }
  if (currentM.length === 1) {
    currentM = `0${currentM}`;
  }
  if (currentDate.length === 1) {
    currentDate = `0${currentDate}`;
  }

  // const tFormat = currentY + "-" + currentM + "-" + currentDate+"T"+currentH+":00:00Z";
  const tFormat = `${currentY}-01-31T${currentH}:00:00Z`;
  // console.log(tFormat);
  const data = await retrieve(url, 'api/count', `?count_type=arima&time=${tFormat}`);
  const filtered = new Array<any>();
  if (data !== undefined && data.length !== 0) {
    for (let i = 0; i < data.length; i += 1) {
      // eg. "time": "2020-01-26T00:00:00Z",
      // const hh = parseInt(data[i].time.substring(11, 13), 10);
      // console.log( hh);

      const cData = {
        dir: data[i].count_direction,
        count: data[i].count,
      };

      filtered.push(cData);
    }
    // console.log(filtered);
  }
  const adapted = tlArimaDataAdapter(filtered);

  const distribution = tlArimaDataToTimeDistribution(adapted);

  return distribution;
}

/**
 * hard coded string directions
 * @param tlId
 */
export function getDirs(tlId: number): string {
  // tl id 0
  // e->w
  // w->e
  if (tlId === 0) {
    return 'e<=>w';
  }

  // tl id 1
  // e->w
  // w->e
  if (tlId === 1) {
    return 'e->e,e->s,w->w,w->n';
  }

  // tl id 2
  // e->n
  // w->s
  if (tlId === 2) {
    return 'e->n,w->s';
  }

  // tl id 3
  // s->w
  // s->s
  // s->n
  // n->e
  // n->s
  // n->w
  if (tlId === 3) {
    return 's<=>n,s->w,s->s,n->e,n->w';
  }

  // tl id 4
  // s->e
  if (tlId === 4) {
    return 's->e';
  }

  return '';
}

/**
 * calculate optimized time for traffic light
 * equation:
 *
 *  |a - r|                 |a - r|
 * ---------   *  a + (1 - --------- ) * r
 *  max(a,r)                max(a,r)
 *
 * @param arimaT
 * @param realTimeT
 */
export function getOptimizedTime(arimaT: number, realTimeT: number): number {
  const deltaT = Math.abs(arimaT - realTimeT);
  /* eslint-disable no-mixed-operators */
  const finalT = ((Math.max(arimaT, realTimeT) * deltaT) / Math.max(arimaT, realTimeT))
    + ((Math.min(arimaT, realTimeT) * Math.min(arimaT, realTimeT)) / Math.max(arimaT, realTimeT));
  return finalT;
}
