/**
 * @class LanePointer
 */
export default class LanePointer {
    sectionId: number;

    laneId: number;

    constructor(sectionId?: number, laneId?: number) {
      this.sectionId = 0;
      if (sectionId !== undefined) {
        this.sectionId = sectionId;
      }
      this.laneId = 0;
      if (laneId !== undefined) {
        this.laneId = laneId;
      }
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
