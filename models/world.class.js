class World {
    character = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    backgroundObject = [
        new BackgroundObject("assets/img/assets/images/5_background/layers/3_third_layer/1.png", 0, 100)
    ];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.addToMapp(this.character);
        this.addObkectsToMap(this.clouds);
        this.addObkectsToMap(this.enemies);
        this.addObkectsToMap(this.backgroundObject);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObkectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMapp(o);
        });
    }

    addToMapp(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
}
