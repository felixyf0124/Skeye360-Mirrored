/**
 * @class Coordinate
 */
export default class Coordinate {

    x: number;
    y: number;

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    //Getters
    getCoordinateX(): number {
        return this.x;
    }
    getCoordinateY(): number {
        return this.y;
    }

    //Setters 
    setCoordinateX(x: number) {
        this.x = x;
    }
    setCoordinateY(y: number) {
        this.y = y;
    }
}