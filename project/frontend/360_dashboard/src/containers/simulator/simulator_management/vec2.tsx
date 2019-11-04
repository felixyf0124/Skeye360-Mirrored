import Vec2 from './vec2';
/**
 * @class vec2
 */

export default class vec2 {
    x: number;

    y: number;

    constructor(x?: number, y?: number) {
      this.x = x || 0;
      this.y = y || 0;
    }

    plus(vec2: vec2): Vec2 {
      const _vec2 = new Vec2(this.x + vec2.x, this.y + vec2.y);
      return _vec2;
    }

    minus(vec2: vec2): Vec2 {
      const _vec2 = new Vec2(this.x - vec2.x, this.y - vec2.y);
      return _vec2;
    }

    multiply(n: number): Vec2 {
      const _vec2 = new Vec2(this.x * n, this.y * n);
      return _vec2;
    }
}
