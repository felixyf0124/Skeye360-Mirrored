import Vec2 from './simulator_management/vec2';
import { func } from 'prop-types';
import vec2 from './simulator_management/vec2';

// export function tsVec2(x:number,y:number){
//     return {x,y};
// }

export function tsVec2(x:number,y:number): Vec2{
    var _vec2 = new Vec2(x,y);
    // _vec2.x = x;
    // _vec2.y = y;
    return _vec2;
}

export function tsRotate(point:Vec2, ang_in_rad:number, origin:Vec2):Vec2{
    
    const _x = point.x-origin.x;
    const _y = point.y-origin.y;
    
    
    var _point = new Vec2();
    _point.x = cos(ang_in_rad) * _x - sin(ang_in_rad) * _y;
    _point.y = sin(ang_in_rad) * _x + cos(ang_in_rad) * _y;
    
    return _point; 
    
}

export function tsRotateByOrigin(point:Vec2, ang_in_rad:number):Vec2{
    return tsRotate(point, ang_in_rad, tsVec2(0,0));
}


export function tsLength(vec2:Vec2):number{
    const _length = Math.sqrt(vec2.x*vec2.x+vec2.y*vec2.y);
    return _length;
}

export function tsNormalize(vec2:Vec2):Vec2{
    
    const _length:number = tsLength(vec2);
    var _vector = new Vec2(
        vec2.x/_length,
        vec2.y/_length
    );
    return _vector;
}

export function tsDotVec2(vec2_a:Vec2, vec2_b:Vec2):number{
    const _product = vec2_a.x * vec2_b.x + vec2_a.y * vec2_b.y;
    return _product;
}

export function tsCrossVec2(vec2_a:Vec2, vec2_b:Vec2){
    const _product = vec2_a.x * vec2_b.y - vec2_a.y * vec2_b.y;
    return _product;
}

//fixing floating error
export function cos(ang_in_rad:number) {
    return Math.round(Math.cos(ang_in_rad)*10000)/10000;
}

export function sin(ang_in_rad:number) {
    return Math.round(Math.sin(ang_in_rad)*10000)/10000;
}

export function lineIntersection(line1:{a:number,b:number,x:number},line2:{a:number,b:number,x:number}):Vec2{
    var _insterectionPoint:Vec2 = new Vec2();
    if(isNaN(line1.x) && isNaN(line2.x))
    {
        var _x = (line2.b - line1.b) / (line1.a - line2.a);
        var _y = line1.a * _x + line1.b;
        _x = Math.round(_x * 10000) /10000;
        _y = Math.round(_y * 10000) /10000;
        _insterectionPoint = new Vec2(_x, _y);
    }else if (isNaN(line1.x) && !isNaN(line2.x))
    {
        var _y = line1.a * line2.x + line1.b;
        _y = Math.round(_y * 10000) /10000;
        _insterectionPoint = new Vec2(line2.x, _y);
    }else if (!isNaN(line1.x) && isNaN(line2.x))
    {
        var _y = line2.a * line1.x + line2.b;
        _y = Math.round(_y * 10000) /10000;
        _insterectionPoint = new Vec2(line1.x, _y);
    }else if (isNaN(line1.x)===false && isNaN(line2.x)===false)
    {
        _insterectionPoint = new Vec2(NaN, NaN);
        console.log(isNaN(line1.x));
        console.log(isNaN(line2.x));

        console.error("Error Parallel Lines");
        console.log(line1);
        console.log(line2);
    }
    
    return _insterectionPoint;
}

export function line(p1:Vec2,p2:Vec2){
    var _a:number,_b:number,_x:number;
    // console.log(p1.x+"|"+p2.x+"|"+(p1.x != p2.x));
    
        const _slop_vec = p1.minus(p2);
        _a = _slop_vec.y/_slop_vec.x;
        // _a = Math.round(_a * 10000) /10000;

        _b = p1.y - _a * p1.x;
    if(isFinite(_a))
    {
        _x = NaN;
    }else
    {
        _a = NaN;
        _b = NaN;
        _x = p1.x;
    }
    const _line = {a:_a, b:_b, x:_x};
    return _line;
}

export function lineShift(line:{a:number, b:number, x:number}, vector:vec2){
    //shift with a point ( 0, b )
    if(isNaN(line.x))
    {
        const _point = new vec2(vector.x, line.b + vector.y);

        // y = ax + b
        // b' = y' - ax';
        const _b = _point.y - line.a * _point.x;
        const _line = {a:line.a, b:_b, x:NaN};
        
        return _line;
    }
    else{
        const _line = {a:NaN, b:NaN, x:line.x+vector.x};
        
        return _line;
    }
}

export function getAngleOfVec(vec:Vec2){
    const _ang = Math.atan(vec.y/vec.x);
    return _ang;
}

