import TrafficLightManager from "./TrafficLightManager";

/**
 * @class TrafficLightManualControl
 */
export default class TrafficLightManualControl {

    trafficLightManager: TrafficLightManager;
    roadIntersectionId: number;

    constructor(roadIntersectionId: number) {
        //The time pairs for the traffic lights will be set to zero
        this.trafficLightManager = new TrafficLightManager(roadIntersectionId, [[0,0],[0,0]], 0, 0);
    }

    stopAllTrafficLights(roadIntersectionId: number) {
        //TODO:
        //Find way to get all traffic lights ids at a specific intersection
        this.trafficLightManager.trafficLight.setTrafficLightStatus("stop");
    }

    setSpecificTrafficLightGreenTime(trafficLightId: number, timeGiven: number) {
        this.stopAllTrafficLights(this.roadIntersectionId);
        this.trafficLightManager.setGreenLight(trafficLightId, timeGiven);
    }
}