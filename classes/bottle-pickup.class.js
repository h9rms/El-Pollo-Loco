import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class BottlePickup extends MovableObject {
    height = 60;
    width = 50;
    constructor(x, y) {
        super().loadImage(ImageHub.bottlePickup);
        this.x = x;
        this.y = y;
    }
}