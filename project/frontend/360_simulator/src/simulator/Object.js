

export default class Object {
    position ={
        x:0,y:0
    };
    positionOffset={
        x:0,y:0
    };
    
    boundingBox={
        head : {x:0,y:0},
        tail : {x:0,y:0},
        width:0
    };
    

    constructor(position_array,positionOffset_obj, directionDeg, directionDegOffset, length, width){
        this.setPositionByArray(position_array);
        this.setPositionOffsetByObj(positionOffset_obj);
        this.directionDeg =directionDeg;
        this.directionDegOffset =directionDegOffset;
        //this.setLocalBoundingBox(length, width);
         
    }

    setPosition(x,y){
        this.position.x = x;
        this.position.y = y;
    }
    setPositionByArray(position_array){
        this.position.x = position_array[0];
        this.position.y = position_array[1];
    }
    setPositionByObj(position_obj){
        this.position = position_obj;
    }

    setPositionOffset(x,y){
        this.positionOffset.x = x;
        this.positionOffset.y = y;
    }
    setPositionOffsetByArray(positionOffset_array){
        this.positionOffset.x = positionOffset_array[0];
        this.positionOffset.y = positionOffset_array[1];
    }
    setPositionOffsetByObj(positionOffset_obj){
        this.positionOffset = positionOffset_obj;
    }

    updatePosition(velocity_array){
        this.position.x += velocity_array[0];
        // canvas coordinates' y axis is inversed
        this.position.y -= velocity_array[1];
    }

    setLocalBoundingBox(length, width){

        this.bounding_box.head = 
        [this.position.x+length/2.0,
            this.position.y];
        this.bounding_box.tail = 
        [this.position.x-length/2.0,
            this.position.y];
        this.bounding_box.width = width;
    }

    getWorldPosition(){
        
        const worldPosition = { 
            x:this.position.x + this.positionOffset.x,
            y:this.position.y + this.positionOffset.y
        }
        return worldPosition;
    }


}
