/**
 * @class LanePointer
 */
export default class LanePointer {
    sectionId: number;

    laneId: number;

    constructor(sectionId?: number, laneId?: number) {
      this.sectionId = sectionId || 0;
      this.laneId = laneId || 0;
    }

    // Getters
    getSectionId(): number {
      return this.sectionId;
    }

    getLaneId(): number {
      return this.laneId;
    }

    // Setters
    setSectionId(sectionId: number): void {
      this.sectionId = sectionId;
    }

    setLaneId(laneId: number): void {
      this.laneId = laneId;
    }

    setIds(sectionId: number, laneId: number): void {
      this.setSectionId(sectionId);
      this.setLaneId(laneId);
    }
}
