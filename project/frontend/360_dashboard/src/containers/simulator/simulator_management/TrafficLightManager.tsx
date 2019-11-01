import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManager
 */
export default class TrafficLightManager {

    //id:number;
    roadIntersection_id:number;
    trafficLightQueue: Array<TrafficLight>;
    countDown: number;
    // countDownOffset: number;

    //TimePairs is an array of an array of numbers?
    //timePairs: Array<Array<number>>;
    startTime: number;
    timeOffset: number;
    //totalTimePeriod: number;
    deltaT: number;

    //constructor(roadIntersectionid:number, startTime:number, timeOffset:number);
    constructor(roadIntersectionid:number, timeOffset?:number){
        this.roadIntersection_id = roadIntersectionid;
        this.trafficLightQueue = new Array<TrafficLight>();
        this.countDown = 0;
        // this.countDownOffset = 0;
        
        //this.timePairs = timePairs;
        this.startTime = Date.now();
        this.timeOffset = timeOffset||0;
        this.deltaT = 0;
        //this.totalTimePeriod = this.calculateTotalPeriodTime(this.timePairs.length);
    }

    //Getters
    // private getTrafficLightManagerId(): number {
    //     return this.id;
    // }
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
    // getTimePairs(): Array<Array<number>> {
    //     return this.timePairs;
    // }
    getStartTime(): number {
        return this.startTime;
    }
    getTimeOffset(): number {
        return this.timeOffset;
    }
    // getTotalTimePeriod(): number {
    //     return this.totalTimePeriod;
    // }
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
    // setTimePairs(timePairs: Array<Array<number>>) {
    //     this.timePairs = timePairs;
    // }
    setStartTime(startTime: number) {
        this.startTime = startTime;
    }
    setTimeOffset(timeOffset: number) {
        this.timeOffset = timeOffset;
    }
    setDeltaT(deltaT: number) {
        this.deltaT = deltaT;
    }
    setAllTrafficLightsAsStop() {
        //This will set all traffic lights at a specific intersection as a red
        for(let index = 0; index < this.trafficLightQueue.length; index++) {
            this.trafficLightQueue[index].setStatus("red");
        }
    }
    setGreenLight(trafficLightId: number, timeGiven:number) {
        var lookup = this.trafficLightQueue.filter(function(trafficLight) {
            return trafficLight.id === trafficLightId;
        });

        //TODO:
        //Check for other traffic lights if its green

        //Check that lookup is not empty or undefined
        // if(!lookup.length || !(lookup === undefined)) {
        //     lookup[0].setTrafficLightStatusCountDown(timeGiven);
        //     lookup[0].setTrafficLightStatus("green");
        // }

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

    getTrafficLightState(id: number):string{
        const state:string = this.getTrafficLight(id).getStatus();
        return state;
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
                    _isUpdating = true;
                continue;
            }
            let _addUp_after_offset = (_addUp + this.trafficLightQueue[i].getOverlapOffset()) % _total;
            if(this.deltaT >= _addUp_after_offset 
                && this.deltaT < _addUp_after_offset + this.trafficLightQueue[i].getGreenTime())
            {
                let _countDown = (_addUp_after_offset + this.trafficLightQueue[i].getGreenTime() - this.deltaT);
                this.trafficLightQueue[i].setCountDown(_countDown.toString());
                if(this.trafficLightQueue[i].getStatus() !== "green")
                {
                    this.trafficLightQueue[i].setStatus("green");
                    _isUpdating = true;
                }
            }else if(this.deltaT >= _addUp_after_offset + this.trafficLightQueue[i].getGreenTime()
                && this.deltaT < _addUp_after_offset + this.trafficLightQueue[i].getGreenTime() + this.trafficLightQueue[i].getYellowTime())
            {
                let _countDown = (_addUp_after_offset + this.trafficLightQueue[i].getGreenTime() + this.trafficLightQueue[i].getYellowTime() - this.deltaT);
                this.trafficLightQueue[i].setCountDown(_countDown.toString());
                if(this.trafficLightQueue[i].getStatus() !== "yellow")
                {
                    this.trafficLightQueue[i].setStatus("yellow");
                    _isUpdating = true;
                }
            }else
            {
                let _countDown = (_addUp_after_offset + _total - this.deltaT) % _total;
                this.trafficLightQueue[i].setCountDown(_countDown.toString());
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

}

