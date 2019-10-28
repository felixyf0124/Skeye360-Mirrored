import TrafficLightManager from "./TrafficLightManager";
import TrafficLight from "./TrafficLight";

/**
 * @class TrafficLightManualControl
 */
export default class TrafficLightManualControl {

    // trafficLightManager: TrafficLightManager;
    roadIntersectionId: number;

    constructor(roadIntersectionId: number) {
        this.roadIntersectionId = roadIntersectionId;
        //The time pairs for the traffic lights will be set to zero
        //this.trafficLightManager = new TrafficLightManager(roadIntersectionId, allTrafficLightsAtIntersection, [[0,0],[0,0]], 0, 0);
        // this.trafficLightManager = new TrafficLightManager(roadIntersectionId, 0, 0);
        // this.stopAllTrafficLights();
    }

    stopAllTrafficLights(trafficLightManager: TrafficLightManager) {
        // console.log("TESTINGinTLMC:"+trafficLightManager.trafficLightQueue.length);
        trafficLightManager.setAllTrafficLightsAsStop();
    }

    setSpecificTrafficLightGreenTime(trafficLightManager: TrafficLightManager, trafficLightId: number, timeGiven: number) {
        trafficLightManager.setGreenLight(trafficLightId, timeGiven);
    }
}