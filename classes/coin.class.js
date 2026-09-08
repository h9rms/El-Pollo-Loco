import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class Coin extends MovableObject {
    height = 60;
    width = 60;
    constructor(x, y) {
        super().loadImage(ImageHub.coin);
        this.x = x;
        this.y = y;
    }
}