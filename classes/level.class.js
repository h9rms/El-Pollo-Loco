/**
 * Represents a game level, holding all enemies, clouds, background layers,
 * coins and bottles that belong to it.
 * @class
 */
export class Level {
    enemies;
    clouds;
    backgroundObject;
    coins;
    bottles;
    level_end_x = 2550;

    /**
     * Creates a new Level.
     * @param {Array} enemies - All enemies placed in this level.
     * @param {Array} clouds - All clouds placed in this level.
     * @param {Array} backgroundObject - All background layer objects placed in this level.
     * @param {Array} [coins] - All coins placed in this level.
     * @param {Array} [bottles] - All bottle pickups placed in this level.
     */
    constructor(enemies, clouds, backgroundObject, coins = [], bottles = []){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObject = backgroundObject;
        this.coins = coins;
        this.bottles = bottles;
    }
}