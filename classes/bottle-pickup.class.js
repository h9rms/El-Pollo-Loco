import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents a bottle lying on the ground that the character can collect
 * to refill its throwable bottle count.
 * @class
 */
export class BottlePickup extends MovableObject {
    height = 60;
    width = 50;

    /**
     * Creates a new BottlePickup at the given position.
     * @param {number} x - The horizontal position of the bottle.
     * @param {number} y - The vertical position of the bottle.
     */
    constructor(x, y) {
        super().loadImage(ImageHub.bottlePickup);
        this.x = x;
        this.y = y;
    }
}