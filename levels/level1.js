import { Level } from "../classes/level.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { SmallChicken } from "../classes/small-chicken.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Cloud } from "../classes/cloud.class.js";
import { BackgroundObject } from "../classes/background-object.class.js";
import { Coin } from "../classes/coin.class.js";
import { BottlePickup } from "../classes/bottle-pickup.class.js";

export function createLevel1() {
    return new Level(
    [
    new Chicken(), 
    new Chicken(), 
    new Chicken(),
    new Chicken(),
    new SmallChicken(),
    new SmallChicken(),
    new SmallChicken(),
    new SmallChicken(),
    new Endboss(),
    ],
    [
        new Cloud()
    ],
    [
    new BackgroundObject("assets/img/assets/images/5_background/layers/air.png",-720,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/2.png",-720,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/2_second_layer/2.png",-720,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/1_first_layer/2.png",-720,),

    new BackgroundObject("assets/img/assets/images/5_background/layers/air.png",0,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/1.png",0,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/2_second_layer/1.png",0,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/1_first_layer/1.png",0,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/air.png",720,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/2.png",720,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/2_second_layer/2.png",720,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/1_first_layer/2.png",720,),

    new BackgroundObject("assets/img/assets/images/5_background/layers/air.png",720*2),
    new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/1.png",720*2,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/2_second_layer/1.png",720*2,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/1_first_layer/1.png",720*2,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/air.png",720*3,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/2.png",720*3,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/2_second_layer/2.png",720*3,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/1_first_layer/2.png",720*3,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/air.png",720*4,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/1.png",720*4,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/2_second_layer/1.png",720*4,),
    new BackgroundObject("assets/img/assets/images/5_background/layers/1_first_layer/1.png",720*4,),
    ],
    [
        new Coin(300, 300),
        new Coin(700, 300),
        new Coin(1100, 300),
        new Coin(1500, 300),
        new Coin(1900, 300),
    ],
    [
        new BottlePickup(500, 370),
        new BottlePickup(900, 370),
        new BottlePickup(1300, 370),
        new BottlePickup(1700, 370),
        new BottlePickup(2100, 370),
    ]

    );
}