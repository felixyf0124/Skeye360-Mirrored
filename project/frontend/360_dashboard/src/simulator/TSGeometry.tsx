import Vec2 from './simulator_management/vec2';

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
    
    
    var _point = new Vec2(
        Math.cos(ang_in_rad) * _x - Math.sin(ang_in_rad) * _y,
        Math.sin(ang_in_rad) * _x + Math.cos(ang_in_rad) * _y
    );

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


export function vec2_multiply(vec2:Vec2,n:number){
    var _vec2= new Vec2(vec2.x * n,vec2.y * n);
    return _vec2;
}

export function vec2_plus(vec2_a:Vec2, vec2_b:Vec2):Vec2{
    var _vec2 = new Vec2(vec2_a.x + vec2_b.x, vec2_a.x + vec2_b.x);
    return _vec2;
}


export function vec2_minus(vec2_a:Vec2, vec2_b:Vec2):Vec2{
    var _vec2 = new Vec2(vec2_a.x - vec2_b.x, vec2_a.y + vec2_b.y);
    return _vec2;
}




