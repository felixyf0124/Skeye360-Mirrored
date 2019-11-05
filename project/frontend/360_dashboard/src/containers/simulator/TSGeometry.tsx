import Vec2 from './simulator_management/vec2';


export function tsVec2(x: number, y: number): Vec2 {
  const vec2 = new Vec2(x, y);
  return vec2;
}

// fixing floating error
export function cos(angInRad: number): number {
  return Math.round(Math.cos(angInRad) * 10000) / 10000;
}

export function sin(angInRad: number): number {
  return Math.round(Math.sin(angInRad) * 10000) / 10000;
}

export function tsRotate(point: Vec2, angInRad: number, origin: Vec2): Vec2 {
  const x = point.x - origin.x;
  const y = point.y - origin.y;


  const p = new Vec2();
  p.x = cos(angInRad) * x - sin(angInRad) * y;
  p.y = sin(angInRad) * x + cos(angInRad) * y;

  return p;
}

export function tsRotateByOrigin(point: Vec2, angInRad: number): Vec2 {
  return tsRotate(point, angInRad, tsVec2(0, 0));
}


export function tsLength(vec2: Vec2): number {
  const length = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
  return length;
}

export function tsNormalize(vec2: Vec2): Vec2 {
  const length: number = tsLength(vec2);
  const vector = new Vec2(
    vec2.x / length,
    vec2.y / length,
  );
  return vector;
}

export function tsDotVec2(vec2A: Vec2, vec2B: Vec2): number {
  const product = vec2A.x * vec2B.x + vec2A.y * vec2B.y;
  return product;
}

export function tsCrossVec2(vec2A: Vec2, vec2B: Vec2): number {
  const product = vec2A.x * vec2B.y - vec2A.y * vec2B.y;
  return product;
}

export function lineIntersection(line1: {a: number;b: number;x: number},
  line2: {a: number;b: number;x: number}): Vec2 {
  let insterectionPoint: Vec2 = new Vec2();
  if (Number.isNaN(line1.x) && Number.isNaN(line2.x)) {
    let x = (line2.b - line1.b) / (line1.a - line2.a);
    let y = line1.a * x + line1.b;
    x = Math.round(x * 10000) / 10000;
    y = Math.round(y * 10000) / 10000;
    insterectionPoint = new Vec2(x, y);
  } else if (Number.isNaN(line1.x) && !Number.isNaN(line2.x)) {
    let y = line1.a * line2.x + line1.b;
    y = Math.round(y * 10000) / 10000;
    insterectionPoint = new Vec2(line2.x, y);
  } else if (!Number.isNaN(line1.x) && Number.isNaN(line2.x)) {
    let y = line2.a * line1.x + line2.b;
    y = Math.round(y * 10000) / 10000;
    insterectionPoint = new Vec2(line1.x, y);
  } else if (Number.isNaN(line1.x) === false
  && Number.isNaN(line2.x) === false) {
    insterectionPoint = new Vec2(NaN, NaN);
  }

  return insterectionPoint;
}

export function line(p1: Vec2, p2: Vec2): {a: number; b: number; x: number} {
  let a: number; let b: number; let x: number;

  const slopVec = p1.minus(p2);
  a = slopVec.y / slopVec.x;

  b = p1.y - a * p1.x;
  if (Number.isFinite(a)) {
    x = NaN;
  } else {
    a = NaN;
    b = NaN;
    x = p1.x;
  }
  const lineObj = { a, b, x };
  return lineObj;
}

export function lineShift(lineObj: {a: number; b: number; x: number},
  vector: Vec2): {a: number; b: number; x: number} {
  // shift with a point ( 0, b )
  if (Number.isNaN(lineObj.x)) {
    const point = new Vec2(vector.x, lineObj.b + vector.y);

    // y = ax + b
    // b' = y' - ax';
    const bTemp = point.y - lineObj.a * point.x;
    const lineTemp = { a: lineObj.a, b: bTemp, x: NaN };

    return lineTemp;
  }

  const lineTemp = { a: NaN, b: NaN, x: lineObj.x + vector.x };

  return lineTemp;
}

export function getAngleOfVec(vec: Vec2): number {
  const ang = Math.atan(vec.y / vec.x);
  return ang;
}
