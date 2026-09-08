import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";

export class Character extends MovableObject {
    height = 280;
    y = 80;
    speed = 10;
    drawFrameEnabled = true;
    IMAGES_WALKING = [
        "assets/img/assets/images/2_character_pepe/2_walk/W-21.png",
        "assets/img/assets/images/2_character_pepe/2_walk/W-22.png",
        "assets/img/assets/images/2_character_pepe/2_walk/W-23.png",
        "assets/img/assets/images/2_character_pepe/2_walk/W-24.png",
        "assets/img/assets/images/2_character_pepe/2_walk/W-25.png",
        "assets/img/assets/images/2_character_pepe/2_walk/W-26.png",
    ];

    IMAGES_JUMPING = [
        "assets/img/assets/images/2_character_pepe/3_jump/J-31.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-32.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-33.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-34.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-35.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-36.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-37.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-38.png",
        "assets/img/assets/images/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "assets/img/assets/images/2_character_pepe/5_dead/D-51.png",
        "assets/img/assets/images/2_character_pepe/5_dead/D-52.png",
        "assets/img/assets/images/2_character_pepe/5_dead/D-53.png",
        "assets/img/assets/images/2_character_pepe/5_dead/D-54.png",
        "assets/img/assets/images/2_character_pepe/5_dead/D-55.png",
        "assets/img/assets/images/2_character_pepe/5_dead/D-56.png",
        "assets/img/assets/images/2_character_pepe/5_dead/D-57.png",
    ];

    IMAGES_HURT = [
        "assets/img/assets/images/2_character_pepe/4_hurt/H-41.png",
        "assets/img/assets/images/2_character_pepe/4_hurt/H-42.png",
        "assets/img/assets/images/2_character_pepe/4_hurt/H-43.png",
    ];

    world;
    constructor() {
        super().loadImage(
            "assets/img/assets/images/2_character_pepe/2_walk/W-21.png"
        );
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

    jump() {
        this.speedY = 25;
    }
}