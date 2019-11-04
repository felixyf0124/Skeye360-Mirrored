import TrafficLightManager from './TrafficLightManager';
import TrafficLight from './TrafficLight';

/**
 * @class TrafficLightManualControl
 */
export default class TrafficLightManualControl {
    roadIntersectionId: number;

    constructor(roadIntersectionId: number) {
      this.roadIntersectionId = roadIntersectionId;
    }

    stopAllTrafficLights(trafficLightManager: TrafficLightManager) {
      trafficLightManager.setAllTrafficLightsAsStop();
    }

    setSpecificTrafficLightGreenTime(trafficLightManager: TrafficLightManager, trafficLightId: number, timeGiven: number) {
      trafficLightManager.setGreenLight(trafficLightId, timeGiven);
    }
}
