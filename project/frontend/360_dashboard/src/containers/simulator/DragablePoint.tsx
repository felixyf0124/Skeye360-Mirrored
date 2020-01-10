import * as PIXI from 'pixi.js-legacy';
import Vec2 from './simulator_management/vec2';

export default class DragablePoint extends PIXI.Graphics {
    isDown:boolean;
    isOver: boolean;
    r:number;
    color:number;
    absolutPos:Vec2;
    offsetRatio:Vec2;
    constructor(position?:Vec2, radius?:number, color?:number){
        super();
        this.isDown = false;
        this.isOver = false;
        this.absolutPos = new Vec2();
        this.offsetRatio= new Vec2(0.7,0.7);
        if(position !== undefined){
            this.x = position.x;
            this.y = position.y;
            this.absolutPos = position;
        }
        
        if(radius !== undefined){
            this.r = radius;
        }else{
            this.r = 1;
        }
        if(color !== undefined){
            this.color = color;
        }else{
            this.color = 0xff5252;
        }

        this.interactive = true;
        this.buttonMode = true;
        this.renderPoint();
        this.on('mousedown', onmousedown = (): void => this.onDown());
      this.on('mouseup', onmouseup = (): void => this.onUp());
      this.on('mouseover', onmouseover = (): void => this.onOver());
      this.on('mouseout', onmouseout = (): void => this.onOut());
    }

    onDown(): void {
        if (this.isOver) {
        //   this.isHit = true;
          this.isDown = true;

        //   this.renderPoint();

        }
      }
  
      onUp(): void {
        this.isDown = false;
      }
  
      onOver(): void {
        this.isOver = true;
      }
  
      onOut(): void {
        this.isOver = false;
        // this.onUp();
      }
    
      renderPoint():void{
          this.clear();
          this.beginFill(this.color, 1);
          this.drawCircle(this.x, this.y, this.r);
          this.endFill();
      }

}