import Vec2 from './simulator_management/vec2';
import * as d3 from "d3";


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

  // north
  sectionArea1.push(new Vec2(0.32044198895027626, 0.8322017458777885));
  sectionArea1.push(new Vec2(0.4718232044198895, 0.9194956353055286));
  sectionArea1.push(new Vec2(0.44419889502762433, 1.0));
  sectionArea1.push(new Vec2(0.22430939226519336, 1.0));

  // west
  sectionArea2.push(new Vec2(0.2883977900552486, 0.4073714839961203));
  sectionArea2.push(new Vec2(0.2165745856353591, 0.49078564500484967));
  sectionArea2.push(new Vec2(0.0, 0.41125121241513096));
  sectionArea2.push(new Vec2(0.0, 0.3375363724539282));

  // south
  sectionArea3.push(new Vec2(0.6408839779005525, 0.3123181377303589));
  sectionArea3.push(new Vec2(0.5767955801104973, 0.2987390882638215));
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
 * TODO save as object
 * {intersectionID:number, sectionAreas:Array<Array<Vec2>>}
 */
export function saveSectionAreas(): void {
  // const sectionAreas = new Array<Array<Vec2>>();
  // const fs = require('browserify-fs');
  // //let jsonObj = JSON.parse(sectionAreas);
  // let data = JSON.stringify(sectionAreas);
  // console.log(data);
  // fs.writeFile('data.json', data, (err:any) => {

  //     // In case of a error throw err.
  //     if (err) throw err;
  // })
}

/**
 * load csv  data
 * @param path 
 */
export function loadCarGenData(path: any): Array<any> {
  
    const array = new Array<{
      id: number,
      tLine:number,
      from: string,
      to:string}>();

  d3.csv(path, (d:any)=>{
    //  console.log(d);
    const strTime = d.time;

    const tLineFormat = /\d+(\.\d+)?/g;
    const matchesArray = strTime.match(tLineFormat);
    let tt=0;
    if (matchesArray != null) {
      const h = parseInt(matchesArray[0], 10);
      const m = parseInt(matchesArray[1], 10);
      //centi-second
      const s = parseInt(matchesArray[2], 10);
      // console.log(m+"|"+s+"|"+ms);
      tt = (((h*60)+m)*60 + s);
    }
    const tLine = tt*1000;
    const row = {
      id: d.id,
      tLine:tLine,
      from: d.from,
      to:d.to
    };
    array.push(row);
    
    return row;
  });

  const obj = array;

  return obj;
  
}


export function sortDataByTime(unsorted:Array<any>):void{

  const sorted = unsorted.sort((a:any,b:any)=>{
    console.log("called");
   
   return a.tLine - b.tLine;
  });
  
  console.log(unsorted);
  
  // return sorted;
}
