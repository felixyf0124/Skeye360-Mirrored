import { number } from "prop-types";

/**
 * @class TrafficLight
 */
export default class TrafficLight {

    id:number;
    //TLManagerId:number;
    countDownSetting:{green:number,yellow:number};
    boundLanes:Array<{section:number,id:number}>;
    //trafficLightStatusCountDown:number;
    //TrafficLightStatus: stop (blinks red), red, yellow, green
    status:string;
    isForced:boolean;
    overlapOffset:number;
    countDown:number;

    constructor(id:number){
        this.id = id;
        //this.TLManagerId = TLManagerId;
        this.countDownSetting = {green:0,yellow:0};
        this.boundLanes = new Array<{section:number,id:number}>();
        //this.trafficLightStatusCountDown = 0;
        this.status = "red";
        this.isForced = false;
        this.overlapOffset = 0;
        this.countDown = NaN;
    }

    //Getters
    getId(): number {
        return this.id;
    }
    // getTrafficLightManagerId(): number {
    //     return this.TLManagerId;
    // }
    getCountDownSetting(): {green:number,yellow:number} {
        return this.countDownSetting;
    }
    getBoundLanes(): Array<{section:number,id:number}> {
        return this.boundLanes;
    }
    // getStateCountDown(): number {
    //     return this.trafficLightStatusCountDown;
    // }
    getStatus(): string {
        return this.status;
    }

    getGreenTime():number{
        return this.countDownSetting.green;
    }

    getYellowTime():number{
        return this.countDownSetting.yellow;
    }

    /**
     * total = green + yellow
     */
    getTotalTime():number{
        const _total = this.countDownSetting.green + this.countDownSetting.yellow;
        return _total;
    }

    getIsForced():boolean{
        return this.isForced;
    }

    getOverlapOffset():number{
        return this.overlapOffset;
    }

    getCountDown():number{
        return this.countDown;
    }

    //Setters
    setId(id:number){
        this.id = id;
    }

    /**
     * this auto defines 
     * yellow = 5
     * green = totalTime - 5
     * totalTime should > 5
     * @param totalTime = 5 + green 
     */
    setTotalTime(totalTime:number){
        try{
            if(totalTime <= 5) throw "invalide total time coutdown setting \n  totalTime <= 5";
            this.countDownSetting = {
                green: totalTime - 5,
                yellow: 5
            };
        }catch(e){
            console.error(e);
        }
    }

    setGreenTime(time:number){
        this.countDownSetting.green = time;
    }

    setYellowTime(time:number){
        this.countDownSetting.yellow = time;
    }

    setStatus(status: string) {
        this.status = status;
    }

    setCountDown(countDown:number){
        this.countDown = countDown;
    }

    setIsForced(isForced:boolean, status?:string){
        this.isForced = isForced;
        if(status !== undefined){
            this.status = status;
        }
    }
    
    setOverlapOffset(overlapOffset:number){
        this.overlapOffset = overlapOffset;
    }

    bindLane(lane:{section:number,id:number}){
        this.boundLanes.push(lane);
    }

    bindLanes(lanes:Array<{section:number,id:number}>){
        for(let i = 0; i<lanes.length; ++i)
        {
            if(!this.isLaneBound(lanes[i]))
            {
                this.boundLanes.push(lanes[i]);
            }
        }
    }

    bindNewLaneGroup(laneGroup:Array<{section:number,id:number}>){
        this.boundLanes = laneGroup;
    }

    isLaneBound(lane:{section:number,id:number}){
        for(let i = 0; i<this.boundLanes.length; ++i)
        {
            if(lane.section === this.boundLanes[i].section && lane.id === this.boundLanes[i].id)
            {
                return true;
            }
        }
        return false;
    }
}

