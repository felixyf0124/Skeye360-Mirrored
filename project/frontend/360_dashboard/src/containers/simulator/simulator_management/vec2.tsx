import * as ts from '../TSGeometry';
/**
 * @class vec2
 */

export default class Vec2 {
    x: number;

    y: number;

    constructor(x?: number, y?: number) {
      this.x = x || 0;
      this.y = y || 0;
    }

    plus(vec2: Vec2): Vec2 {
      const vector = ts.tsVec2(this.x + vec2.x, this.y + vec2.y);
      return vector;
    }

    minus(vec2: Vec2): Vec2 {
      const vector = ts.tsVec2(this.x - vec2.x, this.y - vec2.y);
      return vector;
    }

    multiply(n: number): Vec2 {
      const vector = ts.tsVec2(this.x * n, this.y * n);
      return vector;
    }
}
