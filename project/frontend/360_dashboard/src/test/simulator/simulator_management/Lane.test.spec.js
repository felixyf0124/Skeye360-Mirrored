const assert = require('chai').assert;
import Lane from "../../../containers/simulator/simulator_management/Lane";
import Vec2 from "../../../containers/simulator/simulator_management/vec2";
import LanePointer from "../../../containers/simulator/simulator_management/LanePointer";

describe('class Lane', ()=>{
    let lane = new Lane(1, "straight", 1, 2);
    let pos1, pos2;
    let link1, link2;
    before(()=>{
        pos1 = new Vec2(3, 1);
        pos2 = new Vec2(3, 100);
        link1 = new LanePointer(1,2);
        link2 = new LanePointer(2,3);
    });
    
    it('constructor', ()=>{
        let expected = {
            id:1,
            laneType:'straight',
            laneDirection:1,
            roadSectionId:2,
            objects: [],
            head: {x:0,y:0},
            tail: {x:0,y:0},
            headLinks: [],
            tailLinks: [],
            trafficLightId: 0
        };
        assert.deepEqual(lane, expected);

    });

    it('getters & setters', ()=>{
        lane.setId(5);
        assert.deepEqual(lane.getId(), 5);

        lane.setLaneType("side walk");
        assert.deepEqual(lane.getLaneType(), "side walk");

        assert.deepEqual(lane.getLaneDirection(), 1);

        lane.setRoadSectionId(3);
        assert.deepEqual(lane.getRoadSectionId(), 3);

        lane.setHead(pos1);
        assert.deepEqual(lane.getHead(), pos1);

        lane.setTail(pos2);
        assert.deepEqual(lane.getTail(), pos2);

    });

    it('bindTrafficLightId', ()=>{
        lane.bindTrafficLightId(2);
        assert.deepEqual(lane.getTrafficLightId(), 2);
    });

    it('addHeadLink', ()=>{
        lane.addHeadLink(link1);
        assert.deepEqual(lane.getHeadLink()[0], link1);
        lane.addHeadLink(link2);
        assert.equal(lane.getHeadLink().length, 2, "[message]");
        assert.deepEqual(lane.getHeadLink()[1], link2);
    });

    it('addTailLink', ()=>{
        lane.addTailLink(link2);
        assert.deepEqual(lane.getTailLink()[0], link2);
        lane.addTailLink(link1);
        assert.equal(lane.getTailLink().length, 2, "[message]");
        assert.deepEqual(lane.getTailLink()[1], link1);
    });

    it('addObjId, getObjects, getObjIndex, getObjectIdByIndex', ()=>{
        lane.addObjId(7);
        assert.deepEqual(lane.getObjects(), [7], "[message]");
        assert.deepEqual(lane.getObjIndex(7), 0, "[message]");
        assert.deepEqual(lane.getObjectIdByIndex(0), 7, "[message]");
    });

    it('clearLinks', ()=>{
        lane.clearHeadLinks();
        assert.deepEqual(lane.getHeadLink(), [], "[message]");
        lane.clearTailLinks();
        assert.deepEqual(lane.getTailLink(), [], "[message]");
    });

    it('objGone', ()=>{
        lane.addObjId(6);
        lane.addObjId(5);

        assert.deepEqual(lane.getObjects(), [7,6,5], "[message]");
        assert.deepEqual(lane.getObjects().length, 3, "[message]");

        lane.objGone(6);

        assert.deepEqual(lane.getObjects(), [7,5], "[message]");
        assert.deepEqual(lane.getObjects().length, 2, "[message]");
    });

})