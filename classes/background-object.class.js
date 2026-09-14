import { MovableObject } from "./movable-object.class.js";

/**
 * Represents a single background layer tile used to build the scrolling level background.
 * @class
 */
export class BackgroundObject extends MovableObject{
    width = 720;
    height = 480;

    /**
     * Creates a new BackgroundObject.
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The horizontal position of this tile in the level.
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }

    /**
     * Draws the tile slightly wider than its logical width so it overlaps
     * the next tile by one pixel, hiding any seam caused by canvas scaling.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw onto.
     */
    draw(ctx) {
        ctx.drawImage(this.img, Math.round(this.x), Math.round(this.y), this.width + 1, this.height);
    }
}