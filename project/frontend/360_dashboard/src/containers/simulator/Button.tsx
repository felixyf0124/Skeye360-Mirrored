import * as PIXI from "pixi.js-legacy";

export default class Button extends PIXI.Container {
    button:PIXI.Graphics;
    name:string;
    textStyle: any;
    
    constructor(name?:string){
        super()
        this.button = new PIXI.Graphics();
        this.name = name||"";

        // this.
    }
}