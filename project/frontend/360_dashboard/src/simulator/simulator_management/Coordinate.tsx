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
    private getCoordinateX() {
        return this.x;
    }
    private getCoordinateY() {
        return this.y;
    }

    //Setters 
    private setCoordinateX(x: number) {
        this.x = x;
    }
    private setCoordinateY(y: number) {
        this.y = y;
    }
}