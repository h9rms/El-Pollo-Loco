import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents a regular enemy chicken that walks across the level.
 * @class
 */
export class Chicken extends MovableObject {
    y = 350;
    height = 80;
    width = 80;
    drawFrameEnabled = false;
    dead = false;
    IMAGES_WALKING = ImageHub.chicken.walking;

    /**
     * Creates a new Chicken at a random position with a random walking speed.
     */
    constructor() {
        super().loadImage(ImageHub.chicken.walking[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 600 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /**
     * Starts the chicken's movement and walking animation intervals.
     * Both stop reacting once the chicken is marked as dead.
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