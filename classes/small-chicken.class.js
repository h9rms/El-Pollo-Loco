import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class SmallChicken extends MovableObject {
    y = 380;
    height = 50;
    width = 50;
    drawFrameEnabled = true;
    dead = false;
    IMAGES_WALKING = ImageHub.smallChicken.walking;
    constructor() {
        super().loadImage(ImageHub.smallChicken.walking[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 300 + Math.random() * 2000;
        this.speed = 0.3 + Math.random() * 0.7;
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