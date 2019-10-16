
/**
 * @class Object
 */
export default class Object {
    
    id:number;

    lane_id:number;

    roadSection_id:number;

    //roadIntersection_id:number;

    //state:string;
    
    position:{
        x:number,y:number
    };
   
    
    constructor(id:number, position:{x:number,y:number}, lane_id:number, roadSection_id:number){
       this.id = id;
       this.position = position;
       this.lane_id = lane_id;
       this.roadSection_id = roadSection_id;
       //this.state = "still";
    }

    

    getPosition(){
        return this.position;
    }

    getRoadSectionId(){
        return this.roadSection_id;
    }

}
