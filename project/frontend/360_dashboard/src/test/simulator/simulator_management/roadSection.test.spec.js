import RoadSection from "../../../containers/simulator/simulator_management/RoadSection";
import Vec2 from "../../../containers/simulator/simulator_management/vec2";
import Lane from "../../../containers/simulator/simulator_management/Lane";

const { assert } = require('chai');

describe('class RoadSection', () => {
    var vec1 = new Vec2(1, 1);
    const roadSection = new RoadSection(1, 2, vec1);

    it('Getters & Setters', () => {
        roadSection.setId(2);
        assert.deepEqual(roadSection.getId(), 2);

        var vec2 = new Vec2(0, 0);
        roadSection.setHead(vec2);
        assert.deepEqual(roadSection.getHead(), vec2);

        var vec3 = new Vec2(1, 1);
        roadSection.setTail(vec3);
        assert.deepEqual(roadSection.getTail(), vec3);
        
    });

    it('GetRoadIntersectionId', () => {
        assert.deepEqual(roadSection.getRoadIntersectionId(), 2);
    })

    it('GetTail', () => {
        assert.deepEqual(roadSection.getTail(), vec1);
    })
});