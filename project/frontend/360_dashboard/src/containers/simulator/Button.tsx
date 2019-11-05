import * as PIXI from "pixi.js-legacy";

export default class Button extends PIXI.Graphics {
    background:PIXI.Graphics;
    boarder:PIXI.Graphics;
    text:PIXI.Text;
    name:string;
    id:number;
    btnWidth:number;
    btnHeight:number;
    backgroundColor:number;
    boarderSize:number;
    boarderColor:number;
    isDown:boolean;
    isOver:boolean;
    isHit:boolean;

    constructor(width:number, height:number, name?:string, color?:number, alpha?:number){
        super()
        this.background = new PIXI.Graphics();
        this.boarder = new PIXI.Graphics();
        this.addChild(this.background);
        this.addChild(this.boarder);
        this.name = name||"Button";
        this.id = Date.now();
        this.text = new PIXI.Text(this.name);
        this.addChild(this.text);
        this.backgroundColor = color||0xffffff;
        this.background.alpha = alpha || 1;
        this.boarderSize = 1;
        this.boarderColor = 0x000000;
        
        this.btnWidth = width;
        this.btnHeight = height;
        this.setDemansion(width,height);
        this.setName(this.name);
        this.interactive = true;
        this.buttonMode = true;
        this.isDown = false;
        this.isOver = false;
        this.isHit = false;

        this.on("click",onclick=()=>this.onClick());
        this.on("mousedown",onmousedown=()=>this.onDown());
        this.on("mouseup",onmouseup=()=>this.onUp());
        this.on("mouseover",onmouseover = () =>this.onOver());
        this.on("mouseout",onmouseout = () =>this.onOut());
    }

    onClick(){
        
    }

    onDown(){
        if(this.isOver)
        {
            this.isHit = true;
            this.isDown = true;
        }
    }

    onUp(){
        this.isDown = false;
    }

    onOver(){
        this.isOver = true;
    }

    onOut(){
        this.isOver = false;
    }
    
    setDemansion(width:number, height:number){
        this.btnWidth = width;
        this.btnHeight = height;
        this.setBackground(this.backgroundColor,this.background.alpha,this.boarderSize,this.boarderColor);

    }

    setBackground(color:number, alpha:number,boarderSize?:number,boarderColor?:number){
        this.background.clear();
        this.backgroundColor = color;
        this.background.alpha = alpha||1;
        this.background.beginFill(this.backgroundColor);
        this.background.drawRect(0,0,this.btnWidth,this.btnHeight);
        this.background.endFill();
        this.setBoarder(boarderSize,boarderColor);
    }

    setBoarder(boarderSize?:number,boarderColor?:number){
        this.boarder.clear();

        this.boarderSize = boarderSize||this.boarderSize;
        this.boarderColor = boarderColor||this.boarderColor;
        this.boarder.lineStyle(this.boarderSize,this.boarderColor,1);
        this.boarder.drawRect(0,0,this.btnWidth,this.btnHeight);

    }

    setName(name:string, textStyle?:any){
        this.name = name;
        this.text.text = this.name;
        this.setTextStyle(textStyle||undefined);

    }

    setTextStyle(textStyle?:any){
        this.text.style = textStyle||this.text.style;
        this.text.x = (this.btnWidth-this.text.width)/2;
        this.text.y = (this.btnHeight-this.text.height)/2;
    }

    isPressed():boolean {
        if(this.isHit)
        {
            this.isHit = false;
            return true;
        } else {
            return false;
        }
    }
}