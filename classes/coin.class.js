import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents a collectible coin placed in the level.
 * @class
 */
export class Coin extends MovableObject {
    height = 60;
    width = 60;

    /**
     * Creates a new Coin at the given position.
     * @param {number} x - The horizontal position of the coin.
     * @param {number} y - The vertical position of the coin.
     */
    constructor(x, y) {
        super().loadImage(ImageHub.coin);
        this.x = x;
        this.y = y;
    }
}