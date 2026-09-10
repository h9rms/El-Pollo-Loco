import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class Chicken extends MovableObject {
    y = 350;
    height = 80;
    width = 80;
    drawFrameEnabled = true;
    dead = false;
    IMAGES_WALKING = ImageHub.chicken.walking;
    constructor() {
        super().loadImage(ImageHub.chicken.walking[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

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