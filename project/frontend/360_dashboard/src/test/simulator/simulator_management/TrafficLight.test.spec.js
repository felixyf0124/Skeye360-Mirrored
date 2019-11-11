const assert = require('chai').assert;
import LanePointer from '../../../containers/simulator/simulator_management/LanePointer';
import TrafficLight from '../../../containers/simulator/simulator_management/TrafficLight';

describe('class TrafficLight', ()=>{
    let tl = new TrafficLight(3);
    
    it('id getter & setter', ()=>{
        assert.deepEqual(tl.getId(), 3, "[message]");
        tl.setId(2);
        assert.deepEqual(tl.getId(), 2, "[message]");
    });

    it('countdown setting', ()=>{
        let expected = { green: 0, yellow: 0 };
        assert.deepEqual(tl.getCountDownSetting(), expected, "[message]");
        assert.deepEqual(tl.getTotalTime(), 0, "[message]");
        
        tl.setGreenTime(8);
        expected = { green: 8, yellow: 0 };
        assert.deepEqual(tl.getGreenTime(), 8, "[message]");
        assert.deepEqual(tl.getCountDownSetting(), expected, "[message]");
        assert.deepEqual(tl.getTotalTime(), 8, "[message]");

        tl.setYellowTime(4);
        expected = { green: 8, yellow: 4 };
        assert.deepEqual(tl.getYellowTime(), 4, "[message]");
        assert.deepEqual(tl.getCountDownSetting(), expected, "[message]");
        assert.deepEqual(tl.getTotalTime(), 12, "[message]");

        tl.setTotalTime(15);
        assert.deepEqual(tl.getYellowTime(), 5, "[message]");
        assert.deepEqual(tl.getGreenTime(), 10, "[message]");
        assert.deepEqual(tl.getTotalTime(), 15, "[message]");

        assert.deepEqual(tl.getOverlapOffset(), 0, "[message]");
        tl.setOverlapOffset(-1);
        assert.deepEqual(tl.getOverlapOffset(), -1, "[message]");
    });

    it('status', ()=>{
        assert.deepEqual(tl.getStatus(), 'red', "[message]");

        tl.setStatus('green');
        assert.deepEqual(tl.getStatus(), 'green', "[message]");
    });

    it('force status', ()=>{
        tl.setStatus('yellow');
        assert.deepEqual(tl.getStatus(), 'yellow', "[message]");

        assert.deepEqual(tl.getIsForced(), false, "[message]");

        tl.setIsForced(true);
        assert.deepEqual(tl.getIsForced(), true, "[message]");
        
        tl.setIsForced(false);
        assert.deepEqual(tl.getIsForced(), false, "[message]");

        tl.setIsForced(true, 'red');
        assert.deepEqual(tl.getIsForced(), true, "[message]");
        assert.deepEqual(tl.getStatus(), 'red', "[message]");
    });

    it('bind lanes', ()=>{
        let lane1 = {section:0,id:0};
        let lane2 = {section:2,id:1};
        let lane3 = {section:2,id:2};

        assert.deepEqual(tl.getBoundLanes().length, 0, "[message]");
        assert.deepEqual(tl.getBoundLanes(), [], "[message]");
        assert.deepEqual(tl.isLaneBound(lane1), false, "[message]");

        tl.bindLane(lane1);
        assert.deepEqual(tl.getBoundLanes().length, 1, "[message]");
        assert.deepEqual(tl.getBoundLanes(), [lane1], "[message]");
        assert.deepEqual(tl.isLaneBound(lane1), true, "[message]");

        tl.bindLane(lane2);
        assert.deepEqual(tl.getBoundLanes().length, 2, "[message]");
        assert.deepEqual(tl.getBoundLanes(), [lane1, lane2], "[message]");

        tl.bindLane(lane1);
        assert.deepEqual(tl.getBoundLanes().length, 2, "[message]");
        assert.deepEqual(tl.getBoundLanes(), [lane1, lane2], "[message]");

        tl.bindLanes([lane2,lane3]);
        assert.deepEqual(tl.getBoundLanes().length, 3, "[message]");
        assert.deepEqual(tl.getBoundLanes(), [lane1, lane2, lane3], "[message]");

        tl.bindNewLaneGroup([lane3, lane1, lane1, lane2]);
        assert.deepEqual(tl.getBoundLanes().length, 3, "[message]");
        assert.deepEqual(tl.getBoundLanes(), [lane3, lane1, lane2], "[message]");
    });
});
