import TrafficLightManager from '../../../containers/simulator/simulator_management/TrafficLightManager';
import TrafficLight from '../../../containers/simulator/simulator_management/TrafficLight';
import Vec2 from '../../../containers/simulator/simulator_management/vec2';

const { assert } = require('chai');

describe('class TrafficLightManager', () => {
  const vec2 = new Vec2(1, 1);
  // let roadIntersection = new RoadIntersection(1, vec2, undefined);
  // let trafficLightManager = new TrafficLightManager(new RoadIntersection(1, new Vec2(), undefined), 1);
  const trafficLightManager = new TrafficLightManager(1, 0);
  let trafficLight1; let
    trafficLight2;
  let trafficLightsQueue;
  before(() => {
    trafficLight1 = new TrafficLight(1);
    trafficLight2 = new TrafficLight(2);
    trafficLightsQueue = [trafficLight1, trafficLight2];
  });

  it('Getters & Setters', () => {
    trafficLightManager.setCountDown(8);
    assert.deepEqual(trafficLightManager.getCountDown(), 8);

    trafficLightManager.setStartTime(8888);
    assert.deepEqual(trafficLightManager.getStartTime(), 8888);

    trafficLightManager.setTimeOffset(88);
    assert.deepEqual(trafficLightManager.getTimeOffset(), 88);

    trafficLightManager.setDeltaT(888);
    assert.deepEqual(trafficLightManager.getDeltaT(), 888);

    trafficLightManager.setTrafficLightQueue(trafficLightsQueue);
    assert.deepEqual(trafficLightManager.getTrafficLightQueue(), trafficLightsQueue);
  });

  it('GetRoadIntersectionId', () => {
    assert.deepEqual(trafficLightManager.getRoadIntersectionId(), 1);
  });

  it('GetTrafficLight from queue', () => {
    trafficLightManager.setTrafficLightQueue(trafficLightsQueue);
    assert.deepEqual(trafficLightManager.getTrafficLight(2), trafficLight2);
  });

  it('GetTrafficLightState', () => {
    trafficLightsQueue[0].setStatus('green');
    assert.deepEqual(trafficLightManager.getTrafficLightState(1), 'green');
  });

  it('GetTrafficLightCD', () => {
    trafficLight2.setCountDown(8);
    assert.deepEqual(trafficLightManager.getTrafficLightCD(2), 8);
  });

  it('GetTrafficLightIndex', () => {
    assert.deepEqual(trafficLightManager.getTrafficLightIndex(2), 1);
  });

  it('SetTrafficLightOverlapOffset', () => {
    trafficLightManager.setTrafficLightOverlapOffset(2, 8);
    assert.deepEqual(trafficLight2.getOverlapOffset(), 8);
  });

  it('ForceState check if isForced is true', () => {
    trafficLightManager.forceState(2, 'stop');
    assert.deepEqual(trafficLight2.getIsForced(), true);
  });

  it('ForceState check for status', () => {
    trafficLightManager.forceState(2, 'stop');
    assert.deepEqual(trafficLight2.status, 'stop');
  });

  it('isBlink for true', () => {
    assert.deepEqual(trafficLightManager.isBlink(), true);
  });

  it('isBlink for false', () => {
    assert.deepEqual(trafficLightManager.isBlink(0.8), false);
  });
});
