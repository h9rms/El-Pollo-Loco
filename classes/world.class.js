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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.endbossStatusBar.x = 480;
        this.coinStatusBar.y = 50;
        this.bottleStatusBar.y = 100;
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setPercentage(0);
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        IntervalHub.startInterval(() => {
            this.checkCollision();
            this.checkThrowObjects();
            this.checkBottleCollisions();
            this.checkGameOver();
            this.checkCollectables();
            this.checkEndbossApproach();
        }, 200);
    }

    checkThrowObjects(){
        if(this.keyboard.F && !this.throwLocked && this.bottleCount > 0){
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.throwLocked = true;
            this.bottleCount--;
            this.bottleStatusBar.setPercentage(this.bottleCount * 20);
        }
        if(!this.keyboard.F){
            this.throwLocked = false;
        }
    }

    checkCollision() {
        [...this.level.enemies].forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (this.isJumpingOnTop(enemy) && !(enemy instanceof Endboss)) {
                    this.killEnemy(enemy);
                } else if (!this.character.isHurt()) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                    AudioHub.playOne(AudioHub.CHARACTER_DAMAGE);
                }
            }
        });
    }

    isJumpingOnTop(enemy) {
        return this.character.y + this.character.height < enemy.y + enemy.height / 2;
    }

    killEnemy(enemy) {
        this.playEnemyDeathSound(enemy);
        let index = this.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.level.enemies.splice(index, 1);
        }
    }

    playEnemyDeathSound(enemy) {
        if (enemy instanceof SmallChicken) {
            AudioHub.playOne(AudioHub.CHICKEN_DEAD_2);
        } else if (enemy instanceof Chicken) {
            AudioHub.playOne(AudioHub.CHICKEN_DEAD);
        }
    }

    checkBottleCollisions() {
        [...this.throwableObjects].forEach((bottle) => {
            [...this.level.enemies].forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    AudioHub.playOne(AudioHub.BOTTLE_BREAK);
                    this.damageEnemy(enemy);
                    this.removeBottle(bottle);
                }
            });
        });
    }

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

    removeBottle(bottle) {
        let index = this.throwableObjects.indexOf(bottle);
        if (index > -1) {
            this.throwableObjects.splice(index, 1);
        }
    }

    checkGameOver() {
        if (this.gameOver) {
            return;
        }
        if (this.character.isDead()) {
            this.endGame(false);
            AudioHub.playOne(AudioHub.CHARACTER_DEAD);
        } else if (!this.level.enemies.some((enemy) => enemy instanceof Endboss)) {
            this.endGame(true);
        }
    }

    endGame(won) {
        this.gameOver = true;
        AudioHub.stopAll();
        IntervalHub.stopAllIntervals();
        window.dispatchEvent(new CustomEvent("gameOver", { detail: { won: won } }));
    }

    isEndbossNear() {
        let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (!endboss) {
            return false;
        }
        return Math.abs(this.character.x - endboss.x) < 500;
    }

    checkEndbossApproach() {
        if (this.isEndbossNear() && !this.endbossApproachPlayed) {
            AudioHub.playOne(AudioHub.ENDBOSS_APPROACH);
            this.endbossApproachPlayed = true;
        }
    }

    checkCollectables() {
        this.checkCoinCollection();
        this.checkBottlePickupCollection();
    }

    checkCoinCollection() {
        [...this.level.coins].forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    collectCoin(coin) {
        let index = this.level.coins.indexOf(coin);
        if (index > -1) {
            this.level.coins.splice(index, 1);
        }
        this.coinCount = Math.min(this.coinCount + 1, 5);
        this.coinStatusBar.setPercentage(this.coinCount * 20);
        AudioHub.playOne(AudioHub.COIN_COLLECT);
    }

    checkBottlePickupCollection() {
        [...this.level.bottles].forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.collectBottlePickup(bottle);
            }
        });
    }

    collectBottlePickup(bottle) {
        let index = this.level.bottles.indexOf(bottle);
        if (index > -1) {
            this.level.bottles.splice(index, 1);
        }
        this.bottleCount = Math.min(this.bottleCount + 1, 5);
        this.bottleStatusBar.setPercentage(this.bottleCount * 20);
        AudioHub.playOne(AudioHub.BOTTLE_COLLECT);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObject);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.isEndbossNear()) {
            this.addToMap(this.endbossStatusBar);
        }
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

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

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        this.ctx.restore();
        mo.x = mo.x * -1;
    }
}