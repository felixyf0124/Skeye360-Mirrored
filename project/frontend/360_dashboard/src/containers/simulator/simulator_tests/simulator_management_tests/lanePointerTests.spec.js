import LanePointer from '../../containers/simulator/simulator_management/LanePointer'
// import { expect } from 'chai';

// const assertOriginal = require('assert');
const assert = require('chai').expect;
var lane = require('../../simulator_management/LanePointer.tsx');
const lanePointer = new LanePointer(1,2);
const spyLanePointer = spyOnProperty(lanePointer, 'getSectionId').and.callThrough();
expect(lanePointer.getSectionId).toBe(1);
expect(spyLanePointer).toHaveBeenCalled();