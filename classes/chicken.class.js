import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";

export class Chicken extends MovableObject {
    y = 350;
    height = 80;
    width = 80;
    drawFrameEnabled = true;
    IMAGES_WALKING = [
        "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];
    constructor() {
        super().loadImage(
            "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
        );
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        this.moveLeft();
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}