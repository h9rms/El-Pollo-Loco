class Chicken extends MovableObject {
    y = 350;
    height = 80;
    width = 80;
    IMAGES_WALKING = [
        "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];
    constructor() {
        super().loadImage(
            "assets/img/assets/images/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
        );
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}
