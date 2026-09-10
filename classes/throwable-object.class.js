import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class ThrowableObject extends MovableObject {
    alwaysAboveGround = true;
    IMAGES_ROTATION = ImageHub.bottleRotation;

    constructor(x, y, otherDirection = false) {
        super().loadImage(ImageHub.bottleRotation[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.throw();
        this.animate();
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

    animate() {
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);
    }
}