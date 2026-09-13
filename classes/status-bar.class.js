import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents a status bar (health, coins, bottles or endboss health) that shows
 * one of six images depending on the current percentage.
 * @class
 */
export class StatusBar extends DrawableObject {
    IMAGES;

    percentage = 100;

    /**
     * Creates a new StatusBar.
     * @param {string[]} [images] - The set of six images to use for this bar, from empty to full.
     */
    constructor(images = ImageHub.statusBar.health) {
        super();
        this.IMAGES = images;
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the bar's percentage and switches to the matching image.
     * @param {number} percentage - The new percentage, between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which of the six images matches the current percentage.
     * @returns {number} The index of the matching image, between 0 and 5.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}