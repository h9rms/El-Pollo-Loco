import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents the short splash animation shown at the exact spot where a
 * thrown bottle hits something. Plays once and then marks itself finished.
 * @class
 */
export class BottleSplash extends MovableObject {
    alwaysAboveGround = true;
    IMAGES_SPLASH = ImageHub.bottleSplash;
    finished = false;

    /**
     * Creates a new BottleSplash at the given position and starts its animation.
     * @param {number} x - The horizontal position of the splash.
     * @param {number} y - The vertical position of the splash.
     */
    constructor(x, y) {
        super().loadImage(ImageHub.bottleSplash[0]);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.animate();
    }

    /**
     * Plays through all splash frames once, then marks the splash as finished.
     */
    animate() {
        IntervalHub.startInterval(() => {
            if (this.currentImage >= this.IMAGES_SPLASH.length) {
                this.finished = true;
                return;
            }
            this.playAnimation(this.IMAGES_SPLASH);
        }, 60);
    }
}