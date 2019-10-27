import TrafficLightManager from "./TrafficLightManager";
import TrafficLight from "./TrafficLight";

/**
 * @class TrafficLightManualControl
 */
export default class TrafficLightManualControl {

    trafficLightManager: TrafficLightManager;
    roadIntersectionId: number;

    constructor(roadIntersectionId: number, allTrafficLightsAtIntersection: Array<TrafficLight>) {
        this.roadIntersectionId = roadIntersectionId;
        //The time pairs for the traffic lights will be set to zero
        //this.trafficLightManager = new TrafficLightManager(roadIntersectionId, allTrafficLightsAtIntersection, [[0,0],[0,0]], 0, 0);
        this.trafficLightManager = new TrafficLightManager(roadIntersectionId,  0, 0);
        this.stopAllTrafficLights();
    }

    stopAllTrafficLights() {
        this.trafficLightManager.setAllTrafficLightsAsStop();
    }

    setSpecificTrafficLightGreenTime(trafficLightId: number, timeGiven: number) {
        this.trafficLightManager.setGreenLight(trafficLightId, timeGiven);
    }
}