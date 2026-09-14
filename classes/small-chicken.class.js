import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents a small, faster enemy chicken that walks across the level.
 * @class
 */
export class SmallChicken extends MovableObject {
    y = 380;
    height = 50;
    width = 50;
    drawFrameEnabled = false;
    dead = false;
    IMAGES_WALKING = ImageHub.smallChicken.walking;

    /**
     * Creates a new SmallChicken at a random position with a random walking speed.
     */
    constructor() {
        super().loadImage(ImageHub.smallChicken.walking[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 700 + Math.random() * 2000;
        this.speed = 0.3 + Math.random() * 0.7;
        this.animate();
    }

    /**
     * Starts the small chicken's movement and walking animation intervals.
     * Both stop reacting once the small chicken is marked as dead.
     */
    animate() {
        IntervalHub.startInterval(() => {
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60);
        this.moveLeft();
        IntervalHub.startInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}