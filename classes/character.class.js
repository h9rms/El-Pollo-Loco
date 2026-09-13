import { MovableObject } from "./movable-object.class.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";
import { AudioHub } from "../hubs/audio-hub.class.js";

/**
 * Represents the playable main character controlled by the user.
 * @class
 */
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

    /**
     * Creates the character, loads all of its animations and starts moving.
     */
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

    /**
     * Starts the character's movement input and animation state intervals.
     */
    animate() {
        IntervalHub.startInterval(() => {
            this.handleMovementInput();
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            this.updateAnimationState();
        }, 50);
    }

    /**
     * Reads the current keyboard state and moves or lets the character jump accordingly.
     */
    handleMovementInput() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
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
    }

    /**
     * Stops the running sound if the character just stopped moving,
     * then picks and plays the correct animation for the current state.
     */
    updateAnimationState() {
        let moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        if (this.wasMoving && !moving) {
            AudioHub.stopOne(AudioHub.CHARACTER_RUN);
        }
        this.playCurrentAnimation(moving);
        this.wasMoving = moving;
    }

    /**
     * Chooses which animation to play based on the character's current state.
     * @param {boolean} moving - True if the character is currently moving left or right.
     */
    playCurrentAnimation(moving) {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playJumpingFrame();
        } else if (moving) {
            this.playWalkingFrame();
        } else if (this.isLongIdle()) {
            this.playLongIdleFrame();
        } else {
            this.playIdleFrame();
        }
    }

    /**
     * Plays the walking animation and the running sound.
     */
    playWalkingFrame() {
        this.playAnimation(this.IMAGES_WALKING);
        this.playRunSoundOnce();
    }

    /**
     * Plays the long-idle (sleeping) animation and the snoring sound.
     */
    playLongIdleFrame() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
        this.playSnoringSoundOnce();
    }

    /**
     * Advances the jumping animation, slowed down to every third call.
     */
    playJumpingFrame() {
        this.jumpFrameCounter++;
        if (this.jumpFrameCounter % 3 === 0) {
            this.playAnimation(this.IMAGES_JUMPING);
        }
    }

    /**
     * Advances the idle animation, slowed down to every third call.
     */
    playIdleFrame() {
        this.idleFrameCounter++;
        if (this.idleFrameCounter % 3 === 0) {
            this.playAnimation(this.IMAGES_IDLE);
        }
        this.isSleeping = false;
    }

    /**
     * Plays the running sound once, only when movement just started.
     */
    playRunSoundOnce() {
        if (!this.wasMoving) {
            AudioHub.playOne(AudioHub.CHARACTER_RUN);
        }
        this.isSleeping = false;
    }

    /**
     * Plays the snoring sound once, only when long-idle just started.
     */
    playSnoringSoundOnce() {
        if (!this.isSleeping) {
            AudioHub.playOne(AudioHub.CHARACTER_SNORING);
            this.isSleeping = true;
        }
    }

    /**
     * Checks whether the character has been inactive for more than 15 seconds.
     * @returns {boolean} True if the character should show the long-idle animation.
     */
    isLongIdle() {
        let timeSinceAction = new Date().getTime() - this.lastActionTime;
        return timeSinceAction > 15000;
    }

    /**
     * Makes the character jump and plays the jump sound.
     */
    jump() {
        this.speedY = 25;
        AudioHub.playOne(AudioHub.CHARACTER_JUMP);
    }

    /**
     * Reduces the character's energy by 20 and records the time of the hit.
     */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
}