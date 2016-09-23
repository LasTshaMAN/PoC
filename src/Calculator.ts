export class Calculator {

    left: number;
    right: number;

    constructor(left: number, right: number) {
        this.left = left;
        this.right = right;
    }

    add() {
        return this.left + this.right;
    }
}