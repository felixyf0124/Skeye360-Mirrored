/**
 * @class LanePointer
 */
export default class LanePointer {
    section_id: number;

    lane_id: number;

    constructor(section_id?:number,lane_id?:number) {
        this.section_id = section_id||0;
        this.lane_id = lane_id||0;
    }

    // Getters
    getSectionId(): number {
      return this.section_id;
    }

    getLaneId(): number {
      return this.lane_id;
    }

    // Setters
    setSectionId(section_id: number) {
      this.section_id = section_id;
    }

    setLaneId(lane_id: number) {
      this.lane_id = lane_id;
    }

    setIds(section_id: number, lane_id: number) {
      this.setSectionId(section_id);
      this.setLaneId(lane_id);
    }
}
