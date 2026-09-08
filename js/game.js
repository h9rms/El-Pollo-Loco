import { World } from "../classes/world.class.js";
import { Keyboard } from "../classes/keyboard.class.js";

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    console.log("my character is,", world.character);
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    canvas.style.display = "block";
    init();
}

function setupControlsDialog() {
    let dialog = document.getElementById("controls-dialog");

    document.getElementById("controlsBtn").addEventListener("click", () => {
        dialog.showModal();
    });

    document.getElementById("closeControlsBtn").addEventListener("click", () => {
        dialog.close();
    });

    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    document.getElementById("startBtn").addEventListener("click", startGame);
    setupControlsDialog();
});

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 70) {
        keyboard.F = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 70) {
        keyboard.F = false;
    }
});