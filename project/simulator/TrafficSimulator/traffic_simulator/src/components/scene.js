import React, {Component} from 'react'
//pixi.js-legacy for VM
import * as PIXI from "pixi.js-legacy";
//import * as PIXI from "pixi.js";


export default class scene extends Component {

    constructor(props){
        super(props);
        this.pixi_cnt = null;
        this.app = new PIXI.Application({width:window.innerWidth,height:window.innerHeight});
    }


}