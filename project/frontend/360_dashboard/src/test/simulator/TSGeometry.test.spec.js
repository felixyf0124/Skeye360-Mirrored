import * as ts from '../../containers/simulator/TSGeometry';
import Vec2 from '../../containers/simulator/simulator_management/vec2';

const { assert } = require('chai');

describe('TS Geometry', () => {
  it('tsVec2', () => {
    const vec = ts.tsVec2(1, 2);
    assert.deepEqual(vec, { x: 1, y: 2 }, '[message]');
  });
  it('cos should be rounded up to 4th digit after the point', () => {
    const value = ts.cos(Math.PI / 7); // 0.901
    assert.equal(value.toString().length <= 6, true, value.toString());
  });
  it('sin should be rounded up to 4th digit after the point', () => {
    const value = ts.sin(Math.PI / 7);
    assert.equal(value.toString().length <= 6, true, value.toString());
  });
  it('tsRotate', () => {
    const A = new Vec2(1, 0);
    const B = ts.tsRotate(A, Math.PI / 2, ts.tsVec2(0, 0));
    const C = ts.tsRotateByOrigin(A, Math.PI / 2);
    assert.deepEqual(B, { x: 0, y: 1 }, B);
    assert.deepEqual(B, C, C);
  });
  it('tsLength', () => {
    const A = new Vec2(1, 0);
    assert.equal(ts.tsLength(A), 1, '[message]');

    const B = new Vec2(1, 1);
    const BLength = Math.sqrt(2);
    assert.equal(ts.tsLength(B), BLength, '[message]');
  });
});
