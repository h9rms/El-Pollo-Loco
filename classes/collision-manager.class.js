import { Endboss } from "./endboss.class.js";
import { Chicken } from "./chicken.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";
import { AudioHub } from "../hubs/audio-hub.class.js";

/**
 * Handles all collision detection between the character, enemies and thrown
 * bottles, as well as collecting coins and bottle pickups.
 * @class
 */
export class CollisionManager {
    world;
    recentlyStomped = false;

    /**
     * Creates a new CollisionManager for the given world.
     * @param {World} world - The world this manager checks collisions for.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks every living enemy for a collision with the character.
     */
    checkCollision() {
        let wasFalling = this.world.character.speedY < 0 || this.recentlyStomped;
        [...this.world.level.enemies].forEach((enemy) => {
            if (!enemy.dead && this.world.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, wasFalling);
            }
        });
    }

    /**
     * Kills the enemy if the character jumped on top of it, otherwise
     * damages the character.
     * @param {MovableObject} enemy - The enemy the character collided with.
     * @param {boolean} wasFalling - True if the character was falling at the start of this check.
     */
    handleEnemyCollision(enemy, wasFalling) {
        if (this.isJumpingOnTop(enemy, wasFalling) && !(enemy instanceof Endboss)) {
            this.killEnemy(enemy);
            this.markRecentlyStomped();
            this.world.character.jump();
        } else if (!this.world.character.isHurt()) {
            this.world.character.hit();
            this.world.statusBar.setPercentage(this.world.character.energy);
            AudioHub.playOne(AudioHub.CHARACTER_DAMAGE);
        }
    }

    /**
     * Keeps stomp kills valid for a short grace period, covering enemies
     * that only register a tick or two after the first kill.
     */
    markRecentlyStomped() {
        this.recentlyStomped = true;
        setTimeout(() => {
            this.recentlyStomped = false;
        }, 100);
    }

    /**
     * Checks whether the character was falling onto the given enemy.
     * @param {MovableObject} enemy - The enemy to check against.
     * @param {boolean} wasFalling - True if the character was falling at the start of this check.
     * @returns {boolean} True if this counts as a stomp attack.
     */
    isJumpingOnTop(enemy, wasFalling) {
        return wasFalling && this.world.character.y + this.world.character.height < enemy.y + 35;
    }

    /**
     * Marks an enemy as dead, plays its death sound and starts its death sequence.
     * @param {MovableObject} enemy - The enemy to kill.
     */
    killEnemy(enemy) {
        if (enemy.dead) {
            return;
        }
        enemy.dead = true;
        this.playEnemyDeathSound(enemy);
        if (enemy instanceof Endboss) {
            this.playEndbossDeathSequence(enemy);
        } else {
            this.showDeathImage(enemy);
            setTimeout(() => {
                this.removeEnemyFromLevel(enemy);
            }, 900);
        }
    }

    /**
     * Plays the endboss's death animation frame by frame before removing it from the level.
     * @param {Endboss} enemy - The endboss that was defeated.
     */
    playEndbossDeathSequence(enemy) {
        let frameDelay = 600;
        enemy.IMAGES_DEAD.forEach((path, index) => {
            setTimeout(() => {
                enemy.loadImage(path);
            }, index * frameDelay);
        });
        let lastFrameTime = (enemy.IMAGES_DEAD.length - 1) * frameDelay;
        let holdAfterLastFrame = 600;
        let totalDuration = lastFrameTime + holdAfterLastFrame;
        setTimeout(() => {
            this.removeEnemyFromLevel(enemy);
        }, totalDuration);
    }

    /**
     * Switches a chicken or small chicken to its static death image.
     * @param {MovableObject} enemy - The enemy that was killed.
     */
    showDeathImage(enemy) {
        if (enemy instanceof SmallChicken) {
            enemy.loadImage(ImageHub.smallChicken.dead);
        } else if (enemy instanceof Chicken) {
            enemy.loadImage(ImageHub.chicken.dead);
        }
    }

    /**
     * Removes an enemy from the level's enemy list.
     * @param {MovableObject} enemy - The enemy to remove.
     */
    removeEnemyFromLevel(enemy) {
        let index = this.world.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.world.level.enemies.splice(index, 1);
        }
    }

    /**
     * Plays the matching death sound for the given enemy type.
     * @param {MovableObject} enemy - The enemy that was killed.
     */
    playEnemyDeathSound(enemy) {
        if (enemy instanceof SmallChicken) {
            AudioHub.playOne(AudioHub.CHICKEN_DEAD_2);
        } else if (enemy instanceof Chicken) {
            AudioHub.playOne(AudioHub.CHICKEN_DEAD);
        }
    }

    /**
     * Checks every thrown bottle for a collision with a living enemy.
     */
    checkBottleCollisions() {
        [...this.world.throwableObjects].forEach((bottle) => {
            [...this.world.level.enemies].forEach((enemy) => {
                if (enemy.dead) {
                    return;
                }
                if (bottle.isColliding(enemy)) {
                    AudioHub.playOne(AudioHub.BOTTLE_BREAK);
                    this.damageEnemy(enemy);
                    this.removeBottle(bottle);
                }
            });
        });
    }

    /**
     * Damages the given enemy. The endboss loses energy and its status bar
     * updates, while any other enemy is killed instantly.
     * @param {MovableObject} enemy - The enemy hit by a bottle.
     */
    damageEnemy(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit();
            this.world.endbossStatusBar.setPercentage((enemy.energy / enemy.maxEnergy) * 100);
            if (enemy.isDead()) {
                this.killEnemy(enemy);
            }
        } else {
            this.killEnemy(enemy);
        }
    }

    /**
     * Removes a thrown bottle from the list of active throwable objects.
     * @param {ThrowableObject} bottle - The bottle to remove.
     */
    removeBottle(bottle) {
        let index = this.world.throwableObjects.indexOf(bottle);
        if (index > -1) {
            this.world.throwableObjects.splice(index, 1);
        }
    }

    /**
     * Checks every thrown bottle for reaching ground level and removes it,
     * playing the impact sound.
     */
    checkBottleGroundImpact() {
        [...this.world.throwableObjects].forEach((bottle) => {
            if (bottle.y + bottle.height >= 430) {
                AudioHub.playOne(AudioHub.BOTTLE_BREAK);
                this.removeBottle(bottle);
            }
        });
    }

    /**
     * Checks for both coin and bottle collection.
     */
    checkCollectables() {
        this.checkCoinCollection();
        this.checkBottlePickupCollection();
    }

    /**
     * Checks every coin in the level for a collision with the character.
     */
    checkCoinCollection() {
        [...this.world.level.coins].forEach((coin) => {
            if (this.world.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Removes a coin from the level, increases the coin count and updates
     * the coin status bar and sound.
     * @param {Coin} coin - The coin that was collected.
     */
    collectCoin(coin) {
        let index = this.world.level.coins.indexOf(coin);
        if (index > -1) {
            this.world.level.coins.splice(index, 1);
        }
        this.world.coinCount = Math.min(this.world.coinCount + 1, 5);
        this.world.coinStatusBar.setPercentage(this.world.coinCount * 20);
        AudioHub.playOne(AudioHub.COIN_COLLECT);
    }

    /**
     * Checks every bottle pickup in the level for a collision with the character.
     */
    checkBottlePickupCollection() {
        [...this.world.level.bottles].forEach((bottle) => {
            if (this.world.character.isColliding(bottle)) {
                this.collectBottlePickup(bottle);
            }
        });
    }

    /**
     * Removes a bottle pickup from the level, increases the bottle count and
     * updates the bottle status bar and sound.
     * @param {BottlePickup} bottle - The bottle pickup that was collected.
     */
    collectBottlePickup(bottle) {
        let index = this.world.level.bottles.indexOf(bottle);
        if (index > -1) {
            this.world.level.bottles.splice(index, 1);
        }
        this.world.bottleCount = Math.min(this.world.bottleCount + 1, 5);
        this.world.bottleStatusBar.setPercentage(this.world.bottleCount * 20);
        AudioHub.playOne(AudioHub.BOTTLE_COLLECT);
    }
}