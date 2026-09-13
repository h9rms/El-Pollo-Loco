import { MovableObject } from "./movable-object.class.js";

/**
 * Represents a decorative cloud drifting across the sky.
 * @class
 */
export class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    /**
     * Creates a new Cloud at a random horizontal position.
     */
    constructor() {
        super().loadImage(
            "assets/img/assets/images/5_background/layers/4_clouds/1.png",
        );
        this.x = 200 + Math.random() * 500;
        this.animate();
    }

    /**
     * Moves the cloud to the left once.
     */
    animate() {
        this.moveLeft();
    }
}