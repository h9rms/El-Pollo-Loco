import { World } from "../classes/world.class.js";
import { Keyboard } from "../classes/keyboard.class.js";
import { AudioHub } from "../hubs/audio-hub.class.js";

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
    AudioHub.playOne(AudioHub.GAME_START);
    init();
}

function showEndScreen(won) {
    canvas.style.display = "none";
    let endScreen = document.getElementById("end-screen");
    endScreen.classList.toggle("won", won);
    endScreen.classList.toggle("lost", !won);
    endScreen.style.display = "flex";
}

function restartGame() {
    document.getElementById("end-screen").style.display = "none";
    canvas.style.display = "block";
    AudioHub.stopOne(AudioHub.WINNER);
    init();
}

function goHome() {
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "flex";
    AudioHub.stopOne(AudioHub.WINNER);
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

function setupMuteButton() {
    AudioHub.loadMutedState();
    let button = document.getElementById("muteBtn");
    updateMuteButtonIcon(button);

    button.addEventListener("click", () => {
        AudioHub.setMuted(!AudioHub.muted);
        updateMuteButtonIcon(button);
    });
}

function updateMuteButtonIcon(button) {
    button.innerHTML = AudioHub.muted ? "&#128263;" : "&#128266;";
}

function setupMobileControls() {
    bindControlButton("btnLeft", () => keyboard.LEFT = true, () => keyboard.LEFT = false);
    bindControlButton("btnRight", () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
    bindControlButton("btnJump", () => keyboard.SPACE = true, () => keyboard.SPACE = false);
    bindControlButton("btnThrow", () => keyboard.F = true, () => keyboard.F = false);
}

function bindControlButton(id, onPress, onRelease) {
    let button = document.getElementById(id);
    button.addEventListener("contextmenu", (e) => e.preventDefault());
    button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        onPress();
    }, { passive: false });
    button.addEventListener("touchend", (e) => {
        e.preventDefault();
        onRelease();
    }, { passive: false });
}

function positionPageTitle() {
    let wrapper = document.getElementById("game-wrapper");
    let title = document.getElementById("page-title");
    let wrapperTop = wrapper.getBoundingClientRect().top;
    let titleHeight = title.offsetHeight;
    title.style.top = (wrapperTop / 2 - titleHeight / 2) + "px";
}

window.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    document.getElementById("homeBtn").addEventListener("click", goHome);
    setupControlsDialog();
    setupMuteButton();
    setupMobileControls();
    positionPageTitle();
    document.fonts.ready.then(positionPageTitle);
});

window.addEventListener("resize", positionPageTitle);

window.addEventListener("gameOver", (e) => {
    showEndScreen(e.detail.won);
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