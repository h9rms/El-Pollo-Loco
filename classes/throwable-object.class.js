import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";

export class ThrowableObject extends MovableObject {
    alwaysAboveGround = true;

    constructor(x, y, otherDirection = false) {
        super().loadImage("assets/img/assets/images/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw(){
        this.speedY = 30;
        this.applyGravity();
        IntervalHub.startInterval(() => {
            if (this.otherDirection) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
        }, 25);
    }
}