
export default class TrafficLight {
    
    constructor(timePairs,startTime,timeOffset){
        this.timePairs = timePairs;
        this.deltaT = 0;
        this.startTime = startTime;
        this.timeOffset = timeOffset;
        this.totalTimePeriod = 0;
        for(var i = 0; i<this.timePairs.length;i++){
            this.totalTimePeriod += this.timePairs[i][0];
            this.totalTimePeriod += this.timePairs[i][1];
            
        }
    }

    getTotalTimePeriod (){
       
        return this.totalTimePeriod;
    }

    getTrafficLightStateAtDirection(index){
        this.deltaT = Date.now()-(this.startTime+this.timeOffset);
        const greenTimeStart = this.getGreenTimeStartOffset(index);
        const orangeTimeStart = this.getOrangeTimeStartOffset(index);
        const redTimeStart = this.getRedTimeStartOffset(index);
        const tempT = this.deltaT%(this.totalTimePeriod*1000);
        var currentLightCountDown = 0;
        if(tempT<orangeTimeStart*1000
            && tempT>=greenTimeStart*1000){
                currentLightCountDown = parseInt(this.timePairs[index][0] - (tempT/1000 - greenTimeStart)+1,10);
            return [1,currentLightCountDown];
        }else if(tempT<redTimeStart*1000
            && tempT>=orangeTimeStart*1000){
                currentLightCountDown = parseInt(this.timePairs[index][1] - (tempT/1000 - orangeTimeStart)+1,10);
            return [2,currentLightCountDown];
        }else{
            
            currentLightCountDown = 
            parseInt(
                (this.timePairs[(index-1+this.timePairs.length)%this.timePairs.length][0] + 
                this.timePairs[(index-1+this.timePairs.length)%this.timePairs.length][1])
                 - (tempT/1000 - redTimeStart%this.totalTimePeriod)+1,10);
                
            return [3,currentLightCountDown];
        }
    }

    getGreenTimeStartOffset(index){
        var greenTimeStart = 0;
        for(var i = 0; i<index;i++){
            greenTimeStart += Number(this.timePairs[i][0]);
            greenTimeStart += Number(this.timePairs[i][1]);
        }
        //greenTimeStart +=timePairs[index][0];
        return Number(greenTimeStart);
    }

    getOrangeTimeStartOffset(index){
        var orangeTimeStart = Number(this.getGreenTimeStartOffset(index)) + this.timePairs[index][0];
        return orangeTimeStart;
    }

    getRedTimeStartOffset(index){
        var redTimeStart = (this.getOrangeTimeStartOffset(index) + this.timePairs[index][1]);
        return redTimeStart;
    }

    


}