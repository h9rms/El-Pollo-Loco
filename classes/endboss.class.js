import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

export class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y =  55;
    energy = 20;
    maxEnergy = 20;
    dead = false;
    isHurtState = false;
    hasEngaged = false;
    world;

    IMAGES_WALKING = ImageHub.endboss.walking;
    IMAGES_ALERT = ImageHub.endboss.alert;
    IMAGES_ATTACK = ImageHub.endboss.attack;
    IMAGES_HURT = ImageHub.endboss.hurt;
    IMAGES_DEAD = ImageHub.endboss.dead;

    speed = 3;

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            this.chasePlayer();
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.dead) {
                return;
            } else if (this.isHurtState) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAttacking()) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isPlayerNear()) {
                this.playAnimation(this.IMAGES_ALERT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 300);
    }

    chasePlayer() {
        if (this.dead || !this.isPlayerNear()) {
            return;
        }
        this.otherDirection = this.world.character.x > this.x;
        if (this.isAttacking()) {
            return;
        }
        if (this.world.character.x < this.x) {
            this.moveLeft();
        } else if (this.x < this.world.level.level_end_x) {
            this.moveRight();
        }
    }

    isPlayerNear() {
        if (!this.world) {
            return false;
        }
        let near = Math.abs(this.world.character.x - this.x) < 500;
        if (near) {
            this.hasEngaged = true;
        }
        return this.hasEngaged;
    }

    isAttacking() {
        if (!this.world) {
            return false;
        }
        return this.world.character.isColliding(this);
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.isHurtState = true;
        setTimeout(() => {
            this.isHurtState = false;
        }, 500);
    }

    isDead() {
        return this.energy == 0;
    }
}