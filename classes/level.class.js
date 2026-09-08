export class Level {
    enemies;
    clouds;
    backgroundObject;
    coins;
    bottles;
    level_end_x = 2700;

    constructor(enemies, clouds, backgroundObject, coins = [], bottles = []){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObject = backgroundObject;
        this.coins = coins;
        this.bottles = bottles;
    }
}