import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManager
 */
export default class TrafficLightManager {

    roadIntersection_id:number;
    trafficLightQueue: Array<TrafficLight>;
    countDown: number;

    startTime: number;
    timeOffset: number;
    deltaT: number;

    constructor(roadIntersectionid:number, timeOffset?:number){
        this.roadIntersection_id = roadIntersectionid;
        this.trafficLightQueue = new Array<TrafficLight>();
        this.countDown = 0;
        this.startTime = Date.now();
        this.timeOffset = timeOffset||0;
        this.deltaT = 0;
    }

    //Getters
    getRoadIntersectionId(): number {
        return this.roadIntersection_id;
    }
    getTrafficLightQueue(): Array<TrafficLight> {
        return this.trafficLightQueue;
    }

    /**
     * get by id, not array index
     * @param id 
     */
    getTrafficLight(id:number):TrafficLight{
        return this.trafficLightQueue[this.getTrafficLightIndex(id)];
    }
    getTrafficLightState(id: number):string{
        const state:string = this.getTrafficLight(id).getStatus();
        return state;
    }
    getTrafficLightCD(id:number):number{
        const _cd = this.getTrafficLight(id).getCountDown();
        return _cd;
    }

    getTrafficLightIndex(id:number){
        try{
            for(let i = 0; i < this.trafficLightQueue.length; ++i)
            {
                if(id === this.trafficLightQueue[i].getId())
                {
                    return i;
                }
                
            }
            throw "traffic light at id " + id + " does not exist";

        }catch(e){
            console.error(e);
        }
        return -1;
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
        return this.deltaT
    }

    getTimePeriod():number{
        var _period = 0;
        for(let i = 0; i < this.trafficLightQueue.length; ++i)
        {
            // if the TL is not force to be a certain state then counted
            if(!this.trafficLightQueue[i].getIsForced())
            {
                /**
                 * if overlap offset is less than total time
                 * it means this traffic light partially overlaps with others
                 * otherwise, fully overlaps with others
                 * so should not be counted
                 */
                if (this.trafficLightQueue[i].getOverlapOffset() 
                  < this.trafficLightQueue[i].getTotalTime())
                {
                    _period += (this.trafficLightQueue[i].getTotalTime() 
                            - Math.abs(this.trafficLightQueue[i].getOverlapOffset()));
                }
            }
        }
        return _period;
    }

    //Setters
    setCountDown(countDown: number) {
        this.countDown = countDown;
    }
    setStartTime(startTime: number) {
        this.startTime = startTime;
    }
    setTimeOffset(timeOffset: number) {
        this.timeOffset = timeOffset;
    }
    setDeltaT(deltaT: number) {
        this.deltaT = deltaT;
    }

    setTrafficLightQueue(trafficLightsQueue: Array<TrafficLight>) {
        this.trafficLightQueue = trafficLightsQueue;
    }

    forceState(id:number, state:string){
        this.trafficLightQueue[this.getTrafficLightIndex(id)].setIsForced(true);
        this.trafficLightQueue[this.getTrafficLightIndex(id)].setStatus(state);
    }

    deForceState(id:number){
        this.trafficLightQueue[this.getTrafficLightIndex(id)].setIsForced(false);
    }

    /**
     * add traffic light object to the traffic light queue
     * @param laneGroup 
     * @param time in sec, can be green countdown time or total countdown of green and yellow
     * @param specifiedYellowTime can be undefined, default is 5 sec
     */
    addTrafficLight(laneGroup:Array<{section:number,id:number}>,time:number,specifiedYellowTime?:number){
        
        var _trafficLight = new TrafficLight(this.getTrafficLightQueue().length);
        if(specifiedYellowTime === undefined)
        {
            _trafficLight.setTotalTime(time);
        }else{
            _trafficLight.setGreenTime(time);
            _trafficLight.setYellowTime(specifiedYellowTime);
        }
        _trafficLight.bindNewLaneGroup(laneGroup);
        this.trafficLightQueue.push(_trafficLight);
        
    }

    setTrafficLightOverlapOffset(id:number, overlapOffset:number){
        for(let i = 0; i < this.trafficLightQueue.length; ++i)
        {
            if(this.trafficLightQueue[i].getId() === id)
            {
                this.trafficLightQueue[i].setOverlapOffset(overlapOffset);
                break;
            }
        }
    }

    initialUpdate() :boolean{
        const _total = this.getTimePeriod();
        this.deltaT = (Date.now() - this.startTime)/1000;
        this.deltaT %= _total;
        let _addUp = 0;
        var _isUpdating = false; 
        for(let i = 0; i < this.trafficLightQueue.length; ++i)
        {
            //skip current TL if it is forced set
            if(this.trafficLightQueue[i].getIsForced())
            {
                this.trafficLightQueue[i].setCountDown(NaN);
                _isUpdating = true;
                continue;
            }
            let _addUp_after_offset = (_addUp + this.trafficLightQueue[i].getOverlapOffset()) % _total;
            if(this.deltaT >= _addUp_after_offset 
                && this.deltaT < _addUp_after_offset + this.trafficLightQueue[i].getGreenTime())
            {
                let _countDown = (_addUp_after_offset + this.trafficLightQueue[i].getGreenTime() - this.deltaT);
                this.trafficLightQueue[i].setCountDown(_countDown);
                if(this.trafficLightQueue[i].getStatus() !== "green")
                {
                    this.trafficLightQueue[i].setStatus("green");
                    _isUpdating = true;
                }
            }else if(this.deltaT >= _addUp_after_offset + this.trafficLightQueue[i].getGreenTime()
                && this.deltaT < _addUp_after_offset + this.trafficLightQueue[i].getGreenTime() + this.trafficLightQueue[i].getYellowTime())
            {
                let _countDown = (_addUp_after_offset + this.trafficLightQueue[i].getGreenTime() + this.trafficLightQueue[i].getYellowTime() - this.deltaT);
                this.trafficLightQueue[i].setCountDown(_countDown);
                if(this.trafficLightQueue[i].getStatus() !== "yellow")
                {
                    this.trafficLightQueue[i].setStatus("yellow");
                    _isUpdating = true;
                }
            }else
            {
                let _countDown = (_addUp_after_offset + _total - this.deltaT) % _total;
                this.trafficLightQueue[i].setCountDown(_countDown);
                if(this.trafficLightQueue[i].getStatus() !== "red")
                {
                    this.trafficLightQueue[i].setStatus("red");
                    _isUpdating = true;
                }
            }
            _addUp += this.trafficLightQueue[i].getTotalTime();
        }

        return _isUpdating;
    }

    isBlink(ratio?:number){
        var _ratio:number;

        if(isFinite(ratio||NaN)){
            _ratio = ratio||0.5;
        }else{
            _ratio = 0.5;
        }

        if((Date.now() - this.startTime)%1000>_ratio*1000)
        {
            return true;
        }else
        {
            return false;
        }
    }

}

