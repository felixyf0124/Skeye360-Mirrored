import LanePointer from '../../../containers/simulator/simulator_management/LanePointer';

const { assert } = require('chai');

describe('class LanePointer', () => {
  it('constructor', () => {
    const lanePointer1 = new LanePointer();
    const lanePointer2 = new LanePointer(1, 2);

    assert.deepEqual(lanePointer1, { sectionId: 0, laneId: 0 });
    assert.deepEqual(lanePointer2, { sectionId: 1, laneId: 2 });
  });

  it('getters & setters', () => {
    const lanePointer = new LanePointer();

    assert.deepEqual(lanePointer, { sectionId: 0, laneId: 0 });

    lanePointer.setSectionId(1);
    lanePointer.setLaneId(2);

    assert.equal(lanePointer.getSectionId(), 1);
    assert.equal(lanePointer.getLaneId(), 2);
    assert.isNumber(lanePointer.getSectionId());
    assert.isNumber(lanePointer.getLaneId());

    lanePointer.setIds(3, 4);

    assert.equal(lanePointer.getSectionId(), 3);
    assert.equal(lanePointer.getLaneId(), 4);
  });
});
