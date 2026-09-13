import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";

/**
 * Represents the final boss of the level. It chases the player once it has
 * engaged, attacks on contact and needs several bottle hits to be defeated.
 * @class
 */
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

    /**
     * Creates the Endboss at its fixed starting position and loads all of its animations.
     */
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

    /**
     * Starts the boss's chasing movement and animation state intervals.
     */
    animate() {
        IntervalHub.startInterval(() => {
            this.chasePlayer();
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            this.updateAnimationState();
        }, 300);
    }

    /**
     * Picks and plays the correct animation based on the boss's current state.
     */
    updateAnimationState() {
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
    }

    /**
     * Updates the boss's facing direction and moves it towards the player,
     * as long as it has engaged and is not already attacking.
     */
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

    /**
     * Checks whether the player is close enough to engage the boss.
     * Once engaged, this stays true for the rest of the fight.
     * @returns {boolean} True if the boss has engaged the player.
     */
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

    /**
     * Checks whether the boss is currently touching the player.
     * @returns {boolean} True if the boss is colliding with the character.
     */
    isAttacking() {
        if (!this.world) {
            return false;
        }
        return this.world.character.isColliding(this);
    }

    /**
     * Reduces the boss's energy and briefly shows the hurt animation.
     */
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

    /**
     * Checks whether the boss's energy has reached zero.
     * @returns {boolean} True if the boss is dead.
     */
    isDead() {
        return this.energy == 0;
    }
}