class MyAudio {
    file;
    isLoaded;

    constructor(_file) {
        this.file = new Audio(_file);
    }
}

export class AudioHub {
    static CHARACTER_DAMAGE = new MyAudio("assets/audio/sounds/character/characterDamage.mp3");
    static CHARACTER_DEAD = new MyAudio("assets/audio/sounds/character/characterDead.wav");
    static CHARACTER_JUMP = new MyAudio("assets/audio/sounds/character/characterJump.wav");
    static CHARACTER_RUN = new MyAudio("assets/audio/sounds/character/characterRun.mp3");
    static CHARACTER_SNORING = new MyAudio("assets/audio/sounds/character/characterSnoring.mp3");

    static CHICKEN_DEAD = new MyAudio("assets/audio/sounds/chicken/chickenDead.mp3");
    static CHICKEN_DEAD_2 = new MyAudio("assets/audio/sounds/chicken/chickenDead2.mp3");

    static BOTTLE_COLLECT = new MyAudio("assets/audio/sounds/collectibles/bottleCollectSound.wav");
    static COIN_COLLECT = new MyAudio("assets/audio/sounds/collectibles/collectSound.wav");

    static ENDBOSS_APPROACH = new MyAudio("assets/audio/sounds/endboss/endbossApproach.wav");

    static GAME_START = new MyAudio("assets/audio/sounds/game/gameStart.mp3");

    static BOTTLE_BREAK = new MyAudio("assets/audio/sounds/throwable/bottleBreak.mp3");

    // Array, das alle definierten Audio-Dateien enthaelt
    static allSounds = [
        AudioHub.CHARACTER_DAMAGE,
        AudioHub.CHARACTER_DEAD,
        AudioHub.CHARACTER_JUMP,
        AudioHub.CHARACTER_RUN,
        AudioHub.CHARACTER_SNORING,
        AudioHub.CHICKEN_DEAD,
        AudioHub.CHICKEN_DEAD_2,
        AudioHub.BOTTLE_COLLECT,
        AudioHub.COIN_COLLECT,
        AudioHub.ENDBOSS_APPROACH,
        AudioHub.GAME_START,
        AudioHub.BOTTLE_BREAK,
    ];

    static muted = false;

    // Spielt eine einzelne Audiodatei ab (sofern nicht stummgeschaltet)
    static playOne(sound) {
        if (AudioHub.muted) {
            return;
        }
        sound.file.currentTime = 0;
        sound.file.play().catch(() => {});
    }

    // Stoppt das Abspielen aller Audiodateien
    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.file.pause();
        });
    }

    // Stoppt das Abspielen einer einzelnen Audiodatei
    static stopOne(sound) {
        sound.file.pause();
    }

    // Setzt den Mute-Status, speichert ihn im LocalStorage und stoppt laufende Sounds
    static setMuted(muted) {
        AudioHub.muted = muted;
        if (muted) {
            AudioHub.stopAll();
        }
        localStorage.setItem("muted", muted);
    }

    // Laedt den gespeicherten Mute-Status beim Spielstart
    static loadMutedState() {
        AudioHub.muted = localStorage.getItem("muted") === "true";
    }
}