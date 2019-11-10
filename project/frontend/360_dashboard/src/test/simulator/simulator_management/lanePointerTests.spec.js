//require('babel-core/register');
//require('ts-node/register');
const assert = require('chai').assert;
import LanePointer from "../../../containers/simulator/simulator_management/LanePointer.tsx";
// require("../../../containers/simulator/simulator_management/LanePointer");


describe('class LanePointer', ()=>{
    it('constructor', ()=>{
        const lanePointer1 = new LanePointer();
        assert.equal(lanePointer1.sectionID, 0);
        assert.equal(lanePointer1.laneId, 0);
        
        assert.isNumber(lanePointer1.sectionID);
        assert.isNumber(lanePointer1.laneId);

        const lanePointer2 = new LanePointer(1,2);
        assert.equal(lanePointer2.sectionID, 1);
        assert.equal(lanePointer2.laneId, 2);
        assert.isNumber(lanePointer2.sectionID);
        assert.isNumber(lanePointer2.laneId);
    });

    it('getters & setters', ()=>{
        const lanePointer = new LanePointer();
        assert.equal(lanePointer.sectionID, 0);
        assert.equal(lanePointer.laneId, 0);

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
})