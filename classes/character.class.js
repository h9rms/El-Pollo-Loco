import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";
import { AudioHub } from "../hubs/audio-hub.class.js";

export class Character extends MovableObject {
    height = 280;
    y = 150;
    speed = 10;
    drawFrameEnabled = false;
    IMAGES_WALKING = ImageHub.character.walking;
    IMAGES_JUMPING = ImageHub.character.jumping;
    IMAGES_DEAD = ImageHub.character.dead;
    IMAGES_HURT = ImageHub.character.hurt;
    IMAGES_IDLE = ImageHub.character.idle;
    IMAGES_LONG_IDLE = ImageHub.character.longIdle;
    lastActionTime = new Date().getTime();
    wasMoving = false;
    jumpFrameCounter = 0;
    idleFrameCounter = 0;
    isSleeping = false;

    world;
    constructor() {
        super().loadImage(ImageHub.character.walking[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
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
                this.lastActionTime = new Date().getTime();
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastActionTime = new Date().getTime();
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.lastActionTime = new Date().getTime();
            }
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            let moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;

            if (this.wasMoving && !moving) {
                AudioHub.stopOne(AudioHub.CHARACTER_RUN);
            }

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.jumpFrameCounter++;
                if (this.jumpFrameCounter % 3 === 0) {
                    this.playAnimation(this.IMAGES_JUMPING);
                }
            } else if (moving) {
                this.playAnimation(this.IMAGES_WALKING);
                this.playRunSoundOnce();
            } else if (this.isLongIdle()) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.playSnoringSoundOnce();
            } else {
                this.idleFrameCounter++;
                if (this.idleFrameCounter % 3 === 0) {
                    this.playAnimation(this.IMAGES_IDLE);
                }
                this.isSleeping = false;
            }

            this.wasMoving = moving;
        }, 50);
    }

    playRunSoundOnce() {
        if (!this.wasMoving) {
            AudioHub.playOne(AudioHub.CHARACTER_RUN);
        }
        this.isSleeping = false;
    }

    playSnoringSoundOnce() {
        if (!this.isSleeping) {
            AudioHub.playOne(AudioHub.CHARACTER_SNORING);
            this.isSleeping = true;
        }
    }

    isLongIdle() {
        let timeSinceAction = new Date().getTime() - this.lastActionTime;
        return timeSinceAction > 15000;
    }

    jump() {
        this.speedY = 25;
        AudioHub.playOne(AudioHub.CHARACTER_JUMP);
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
}