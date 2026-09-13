import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";

/**
 * Base class for every object that can move, fall under gravity,
 * collide with other objects and take damage.
 * @class
 */
export class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Starts a repeating interval that applies gravity to the object,
     * pulling it down until it reaches the ground.
     */
    applyGravity() {
        IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is currently above the ground.
     * @returns {boolean} True if the object is above the ground.
     */
    isAboveGround() {
        if (this.alwaysAboveGround) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Checks whether this object is colliding with another object.
     * @param {MovableObject} mo - The other object to check against.
     * @returns {boolean} True if the two objects overlap.
     */
    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.x < mo.x + mo.width &&
            this.y + this.height > mo.y &&
            this.y < mo.y + mo.height
        );
    }

    /**
     * Reduces the object's energy by a fixed amount and records the time of the hit.
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object is still within its short damage cooldown.
     * @returns {boolean} True if the object was hit less than 0.5 seconds ago.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * Checks whether the object's energy has reached zero.
     * @returns {boolean} True if the object is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Advances the object's animation by one frame from the given image set.
     * @param {string[]} images - The array of image paths that make up the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by its current speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its current speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by giving it an upward vertical speed.
     */
    jump() {
        this.speedY = 25;
    }
}