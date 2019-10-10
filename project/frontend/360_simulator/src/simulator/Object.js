import { Attribute } from "pixi.js-legacy";


export default class Object {
    position ={
        x:0,y:0
    };
    positionOffset={
        x:0,y:0
    };
    //head = {x:0,y:0};
    //tail = {x,y};
    boundingBox={
        head : {x:0,y:0},
        tail : {x:0,y:0},
        width:0
    };
    

    constructor(position,positionOffset, directionDeg, directionDegOffset, length, width){
        this.position = position;
        this.positionOffset = positionOffset;
        this.directionDeg =directionDeg;
        this.directionDegOffset =directionDegOffset;
        //this.setLocalBoundingBox(length, width);
         
    }

    setPosition(position){
        this.position = position;
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

        


}
