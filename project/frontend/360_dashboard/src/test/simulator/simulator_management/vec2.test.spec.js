const assert = require('chai').assert;
import Vec2 from "../../../containers/simulator/simulator_management/vec2";
import { isTSAnyKeyword } from "@babel/types";

describe('Class Vec2', ()=>{

    it('constructor', ()=>{
        let vec = new Vec2();
        let expected = {x:0,y:0};
        assert.deepEqual(vec, expected, "[message]");
        vec = new Vec2(2,3);
        expected = {x:2,y:3};
        assert.deepEqual(vec, expected, "[message]");
    });

    it('plus', ()=>{
        let A = new Vec2(3,1);
        let B = new Vec2(2,3);
        let C = A.plus(B);
        let D = B.plus(A);
        assert.deepEqual(C, {x:5,y:4}, "[message]");
        assert.deepEqual(C, D, "[message]");
    });

    it('minus', ()=>{
        let A = new Vec2(3,1);
        let B = new Vec2(2,3);
        let C = A.minus(B);
        let D = B.minus(A);
        assert.deepEqual(C, {x:1,y:-2}, "[message]");
        assert.notDeepEqual(C, D, "[message]");
        assert.deepEqual(D, {x:-1,y:2}, "[message]");
    });

    it('multiply', ()=>{
        let A = new Vec2(3,1);
        let B = A.multiply(4);
        assert.deepEqual(B, {x:12,y:4}, "[message]");
    });

});