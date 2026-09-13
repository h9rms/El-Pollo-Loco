import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents a bottle that has been thrown by the character. It flies in a
 * straight direction, falls under gravity and rotates while in the air.
 * @class
 */
export class ThrowableObject extends MovableObject {
    alwaysAboveGround = true;
    IMAGES_ROTATION = ImageHub.bottleRotation;

    /**
     * Creates a new ThrowableObject and immediately starts its flight.
     * @param {number} x - The horizontal starting position of the bottle.
     * @param {number} y - The vertical starting position of the bottle.
     * @param {boolean} [otherDirection] - True if the bottle should fly to the left.
     */
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

    /**
     * Starts the bottle's horizontal flight and its falling motion.
     */
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

    /**
     * Starts the bottle's rotation animation while it is in flight.
     */
    animate() {
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);
    }
}