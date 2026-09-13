import { Character } from "../classes/character.class.js";
import { StatusBar } from "../classes/status-bar.class.js";
import { ThrowableObject } from "../classes/throwable-object.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { SmallChicken } from "../classes/small-chicken.class.js";
import { createLevel1 } from "../levels/level1.js";
import { IntervalHub } from "../hubs/interval-hub.class.js";
import { ImageHub } from "../hubs/image-hub.class.js";
import { AudioHub } from "../hubs/audio-hub.class.js";

/**
 * Represents the game world. It owns the character, the current level,
 * all status bars and the main render and game logic loops.
 * @class
 */
export class World {
    character = new Character();
    level = createLevel1();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    endbossStatusBar = new StatusBar();
    coinStatusBar = new StatusBar(ImageHub.statusBar.coin);
    bottleStatusBar = new StatusBar(ImageHub.statusBar.bottle);
    coinCount = 0;
    bottleCount = 0;
    throwableObjects = [];
    throwLocked = false;
    gameOver = false;
    endbossApproachPlayed = false;

    /**
     * Creates a new World, wires up the status bars, starts the background
     * music and begins the render and game logic loops.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the game onto.
     * @param {Keyboard} keyboard - The keyboard object tracking pressed keys.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.endbossStatusBar.x = 480;
        this.coinStatusBar.y = 50;
        this.bottleStatusBar.y = 100;
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setPercentage(0);
        AudioHub.playMusic(AudioHub.BACKGROUND_MUSIC);
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Gives the character and the endboss a reference back to this world.
     */
    setWorld() {
        this.character.world = this;
        let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (endboss) {
            endboss.world = this;
        }
    }

    /**
     * Recalculates the camera position so it smoothly follows the character,
     * shifting to show more of the endboss if it is near and behind the character.
     */
    updateCamera() {
        let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        let offset = 100;
        if (endboss && this.isEndbossNear() && endboss.x < this.character.x) {
            offset = 350;
        }
        let targetCameraX = -this.character.x + offset;
        this.camera_x += (targetCameraX - this.camera_x) * 0.15;
    }

    /**
     * Starts the main game logic loop that checks collisions, throws,
     * collectables and the game-over condition.
     */
    run() {
        IntervalHub.startInterval(() => {
            this.checkCollision();
            this.checkThrowObjects();
            this.checkBottleCollisions();
            this.checkBottleGroundImpact();
            this.checkGameOver();
            this.checkCollectables();
            this.checkEndbossApproach();
        }, 1000 / 60);
    }

    /**
     * Throws a new bottle if the throw key is pressed, a bottle is available
     * and no throw is already in progress.
     */
    checkThrowObjects(){
        if(this.keyboard.F && !this.throwLocked && this.bottleCount > 0){
            let facingLeft = this.character.otherDirection;
            let spawnX = facingLeft ? this.character.x - 50 : this.character.x + 100;
            let bottle = new ThrowableObject(spawnX, this.character.y + 100, facingLeft);
            this.throwableObjects.push(bottle);
            this.throwLocked = true;
            this.bottleCount--;
            this.bottleStatusBar.setPercentage(this.bottleCount * 20);
        }
        if(!this.keyboard.F){
            this.throwLocked = false;
        }
    }

    /**
     * Checks every living enemy for a collision with the character.
     */
    checkCollision() {
        [...this.level.enemies].forEach((enemy) => {
            if (!enemy.dead && this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy);
            }
        });
    }

    /**
     * Kills the enemy if the character jumped on top of it, otherwise
     * damages the character.
     * @param {MovableObject} enemy - The enemy the character collided with.
     */
    handleEnemyCollision(enemy) {
        if (this.isJumpingOnTop(enemy) && !(enemy instanceof Endboss)) {
            this.killEnemy(enemy);
            this.character.jump();
        } else if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            AudioHub.playOne(AudioHub.CHARACTER_DAMAGE);
        }
    }

    /**
     * Checks whether the character is currently falling onto the given enemy.
     * @param {MovableObject} enemy - The enemy to check against.
     * @returns {boolean} True if this counts as a stomp attack.
     */
    isJumpingOnTop(enemy) {
        return this.character.speedY < 0 && this.character.y + this.character.height < enemy.y + enemy.height * 0.7;
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
        let index = this.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.level.enemies.splice(index, 1);
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
        [...this.throwableObjects].forEach((bottle) => {
            [...this.level.enemies].forEach((enemy) => {
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
            this.endbossStatusBar.setPercentage((enemy.energy / enemy.maxEnergy) * 100);
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
        let index = this.throwableObjects.indexOf(bottle);
        if (index > -1) {
            this.throwableObjects.splice(index, 1);
        }
    }

    /**
     * Checks every thrown bottle for reaching ground level and removes it,
     * playing the impact sound.
     */
    checkBottleGroundImpact() {
        [...this.throwableObjects].forEach((bottle) => {
            if (bottle.y + bottle.height >= 430) {
                AudioHub.playOne(AudioHub.BOTTLE_BREAK);
                this.removeBottle(bottle);
            }
        });
    }

    /**
     * Checks whether the character has died or the endboss has been defeated,
     * and ends the game accordingly.
     */
    checkGameOver() {
        if (this.gameOver) {
            return;
        }
        if (this.character.isDead()) {
            this.endGame(false);
            AudioHub.playOne(AudioHub.CHARACTER_DEAD);
        } else if (!this.level.enemies.some((enemy) => enemy instanceof Endboss)) {
            this.endGame(true);
            AudioHub.playOne(AudioHub.WINNER);
        }
    }

    /**
     * Stops all sounds and intervals and informs the rest of the app that the game has ended.
     * @param {boolean} won - True if the player won, false if the player lost.
     */
    endGame(won) {
        this.gameOver = true;
        AudioHub.stopAll();
        IntervalHub.stopAllIntervals();
        window.dispatchEvent(new CustomEvent("gameOver", { detail: { won: won } }));
    }

    /**
     * Checks whether the endboss has engaged the player.
     * @returns {boolean} True if the endboss is near and its status bar should be shown.
     */
    isEndbossNear() {
        let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (!endboss) {
            return false;
        }
        return endboss.hasEngaged;
    }

    /**
     * Plays the endboss approach sound once, the first time the boss is near.
     */
    checkEndbossApproach() {
        if (this.isEndbossNear() && !this.endbossApproachPlayed) {
            AudioHub.playOne(AudioHub.ENDBOSS_APPROACH);
            this.endbossApproachPlayed = true;
        }
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
        [...this.level.coins].forEach((coin) => {
            if (this.character.isColliding(coin)) {
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
        let index = this.level.coins.indexOf(coin);
        if (index > -1) {
            this.level.coins.splice(index, 1);
        }
        this.coinCount = Math.min(this.coinCount + 1, 5);
        this.coinStatusBar.setPercentage(this.coinCount * 20);
        AudioHub.playOne(AudioHub.COIN_COLLECT);
    }

    /**
     * Checks every bottle pickup in the level for a collision with the character.
     */
    checkBottlePickupCollection() {
        [...this.level.bottles].forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
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
        let index = this.level.bottles.indexOf(bottle);
        if (index > -1) {
            this.level.bottles.splice(index, 1);
        }
        this.bottleCount = Math.min(this.bottleCount + 1, 5);
        this.bottleStatusBar.setPercentage(this.bottleCount * 20);
        AudioHub.playOne(AudioHub.BOTTLE_COLLECT);
    }

    /**
     * Clears the canvas and redraws the background, status bars and world
     * objects, then schedules the next frame.
     */
    draw() {
        this.updateCamera();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawStatusBars();
        this.drawWorldObjects();
        this.scheduleNextFrame();
    }

    /**
     * Draws the scrolling background layers.
     */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObject);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all status bars fixed to the screen, including the endboss bar if it is near.
     */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.isEndbossNear()) {
            this.addToMap(this.endbossStatusBar);
        }
    }

    /**
     * Draws the character and all moving world objects that scroll with the camera.
     */
    drawWorldObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Schedules the next call to draw() using the browser's animation frame loop.
     */
    scheduleNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws every object in the given array onto the canvas.
     * @param {DrawableObject[]} objects - The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single object onto the canvas, flipping it horizontally if needed.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the canvas horizontally around the given object so it appears mirrored.
     * @param {DrawableObject} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas after a horizontal flip.
     * @param {DrawableObject} mo - The object that was flipped.
     */
    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }
}