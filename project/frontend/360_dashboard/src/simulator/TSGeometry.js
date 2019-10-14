
export function tsVec2(x,y){
    return {x,y};
}

export function tsRotate(point_obj_x_y, ang_in_rad, origin_obj_x_y){
    
    const _x = point_obj_x_y.x-origin_obj_x_y.x;
    const _y = point_obj_x_y.y-origin_obj_x_y.y;
    
    
    const _point = {
        x: Math.cos(ang_in_rad) * _x - Math.sin(ang_in_rad) * _y,
        y: Math.sin(ang_in_rad) * _x + Math.cos(ang_in_rad) * _y
    }

    return _point; 
    
}

export function tsRotateByOrigin(point_obj_x_y, ang_in_rad){
    return this.tsRotate(point_obj_x_y, ang_in_rad, tsVec2(0,0));
}


export function tsLength({x,y}){
    const _length = Math.sqrt(x*x+y*y);
    return _length;
}

export function tsNormalize({x,y}){
    
    const _length = tsLength({x,y});
    const _vector = {
        _x: x/_length,
        _y: y/_length
    }
    return _vector;
}

export function tsDotVec2(vec2_a, vec2_b){
    const _product = vec2_a.x * vec2_b.x + vec2_a.y * vec2_b.y;
    return _product;
}

export function tsCrossVec2(vec2_a, vec2_b){
    const _product = vec2_a.x * vec2_b.y - vec2_a.y * vec2_b.y;
    return _product;
}



