import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y =  55;
    energy = 20;
    maxEnergy = 20;
    IMAGES_WALKING = ImageHub.endboss.alert;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2500;
        this.animate();
    }
    animate() {
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}