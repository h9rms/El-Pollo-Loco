/**
 * Base class for every object that can be drawn onto the canvas.
 * @class
 */
export class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads a single image and sets it as the object's current image.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object's current image onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw onto.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a debug collision frame around the object, if enabled.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw onto.
     */
    drawFrame(ctx) {
        if (this.drawFrameEnabled) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Preloads multiple images into the image cache for later use in animations.
     * @param {string[]} arr - An array of image paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            img.style = "transform: scaleX(-1)";
            this.imageCache[path] = img;
        });
    }
}