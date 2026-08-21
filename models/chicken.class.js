class Chicken extends MovableObject {
    y = 300;
    constructor() {
        super().loadImage(
            "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        );
        this.x = 200 + Math.random() * 500;
    }
}
