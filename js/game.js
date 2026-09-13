import { World } from "../classes/world.class.js";
import { Keyboard } from "../classes/keyboard.class.js";
import { AudioHub } from "../hubs/audio-hub.class.js";

let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Creates the canvas reference and starts a new World.
 */
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

/**
 * Hides the start screen, shows the canvas, plays the start sound
 * and initializes a new game.
 */
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    canvas.style.display = "block";
    showMobileControls();
    AudioHub.playOne(AudioHub.GAME_START);
    init();
}

/**
 * Hides the canvas and shows the end screen with the matching win/lose styling.
 * @param {boolean} won - True if the player won, false if the player lost.
 */
function showEndScreen(won) {
    canvas.style.display = "none";
    hideMobileControls();
    let endScreen = document.getElementById("end-screen");
    endScreen.classList.toggle("won", won);
    endScreen.classList.toggle("lost", !won);
    endScreen.style.display = "flex";
}

/**
 * Hides the end screen, shows the canvas, stops the winner sound
 * and starts a fresh game.
 */
function restartGame() {
    document.getElementById("end-screen").style.display = "none";
    canvas.style.display = "block";
    showMobileControls();
    AudioHub.stopOne(AudioHub.WINNER);
    init();
}

/**
 * Hides the end screen, shows the start screen again and stops the winner sound.
 */
function goHome() {
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "flex";
    hideMobileControls();
    AudioHub.stopOne(AudioHub.WINNER);
}

/**
 * Shows the mobile touch controls, if the current screen size calls for them.
 */
function showMobileControls() {
    document.getElementById("mobile-controls").classList.add("active");
}

/**
 * Hides the mobile touch controls.
 */
function hideMobileControls() {
    document.getElementById("mobile-controls").classList.remove("active");
}

/**
 * Wires up the controls dialog to open, close and close-on-backdrop-click.
 */
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

/**
 * Loads the saved mute state and wires up the mute button.
 */
function setupMuteButton() {
    AudioHub.loadMutedState();
    let button = document.getElementById("muteBtn");
    updateMuteButtonIcon(button);

    button.addEventListener("click", () => {
        AudioHub.setMuted(!AudioHub.muted);
        updateMuteButtonIcon(button);
        button.blur();
        ensureBackgroundMusicPlaying();
    });
}

/**
 * Starts the background music if the game is currently running, the game
 * is not muted and the music is not already playing.
 */
function ensureBackgroundMusicPlaying() {
    let gameActive = canvas.style.display === "block";
    if (!AudioHub.muted && gameActive && AudioHub.BACKGROUND_MUSIC.file.paused) {
        AudioHub.playMusic(AudioHub.BACKGROUND_MUSIC);
    }
}

/**
 * Updates the mute button's icon to match the current mute state.
 * @param {HTMLElement} button - The mute button element.
 */
function updateMuteButtonIcon(button) {
    button.innerHTML = AudioHub.muted ? "&#128263;" : "&#128266;";
}

/**
 * Wires up all four mobile touch control buttons to the keyboard state.
 */
function setupMobileControls() {
    bindControlButton("btnLeft", () => keyboard.LEFT = true, () => keyboard.LEFT = false);
    bindControlButton("btnRight", () => keyboard.RIGHT = true, () => keyboard.RIGHT = false);
    bindControlButton("btnJump", () => keyboard.SPACE = true, () => keyboard.SPACE = false);
    bindControlButton("btnThrow", () => keyboard.F = true, () => keyboard.F = false);
}

/**
 * Binds press and release handlers to a touch control button and disables its context menu.
 * @param {string} id - The element ID of the button.
 * @param {Function} onPress - Called when the button is pressed.
 * @param {Function} onRelease - Called when the button is released.
 */
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

/**
 * Positions the page title exactly halfway between the top of the page
 * and the top of the game wrapper.
 */
function positionPageTitle() {
    let wrapper = document.getElementById("game-wrapper");
    let title = document.getElementById("page-title");
    let wrapperTop = wrapper.getBoundingClientRect().top;
    let titleHeight = title.offsetHeight;
    let top = Math.max(0, wrapperTop / 2 - titleHeight / 2);
    title.style.top = top + "px";
}

/**
 * Recalculates and applies the game wrapper's size based on the current
 * viewport, keeping its 3:2 aspect ratio and leaving room for the title.
 */
function resizeGameWrapper() {
    if (isMobileLandscape()) {
        resizeForMobileLandscape();
    } else {
        resizeForDesktop();
    }
    positionPageTitle();
}

/**
 * Checks whether the current viewport matches the small-screen landscape
 * breakpoint used for mobile touch controls.
 * @returns {boolean} True if the viewport is a small landscape screen.
 */
function isMobileLandscape() {
    return window.innerWidth <= 1024 && window.innerWidth > window.innerHeight;
}

/**
 * Sizes the game wrapper to fill the full viewport height and 75% of its width.
 */
function resizeForMobileLandscape() {
    let wrapper = document.getElementById("game-wrapper");
    wrapper.style.width = (window.innerWidth * 0.75) + "px";
    wrapper.style.height = window.innerHeight + "px";
}

/**
 * Sizes the game wrapper to fit the viewport while keeping its 3:2 aspect
 * ratio and leaving room for the title and imprint link.
 */
function resizeForDesktop() {
    let wrapper = document.getElementById("game-wrapper");
    let title = document.getElementById("page-title");
    let imprintLink = document.getElementById("imprintLink");
    let titleHeight = title.offsetHeight;
    let imprintHeight = imprintLink.offsetHeight;
    let availableHeight = window.innerHeight - titleHeight - imprintHeight;
    let maxWidthFromHeight = availableHeight * 1.5;
    let width = Math.min(720, window.innerWidth, maxWidthFromHeight);
    let height = width * (2 / 3);
    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";
}

window.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("restartBtn").addEventListener("click", restartGame);
    document.getElementById("homeBtn").addEventListener("click", goHome);
    setupControlsDialog();
    setupMuteButton();
    setupMobileControls();
    resizeGameWrapper();
    document.fonts.ready.then(positionPageTitle);
});

window.addEventListener("resize", resizeGameWrapper);
window.addEventListener("orientationchange", resizeGameWrapper);

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
        e.preventDefault();
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