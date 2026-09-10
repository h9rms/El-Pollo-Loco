class MyAudio {
    file;
    isLoaded;

    constructor(_file, options = {}) {
        this.file = new Audio(_file);
        if (options.volume !== undefined) {
            this.file.volume = options.volume;
        }
        if (options.loop) {
            this.file.loop = true;
        }
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
    static BACKGROUND_MUSIC = new MyAudio("assets/audio/sounds/game/background-music.mp3", { volume: 0.3, loop: true });
    static WINNER = new MyAudio("assets/audio/sounds/game/winner.mp3");

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
        AudioHub.BACKGROUND_MUSIC,
        AudioHub.WINNER,
        AudioHub.BOTTLE_BREAK,
    ];

    static muted = false;
    static pausedByMute = [];

    // Spielt eine einzelne Audiodatei ab (sofern nicht stummgeschaltet)
    static playOne(sound) {
        if (AudioHub.muted) {
            return;
        }
        sound.file.currentTime = 0;
        sound.file.play().catch(() => {});
    }

    // Startet ein Musikstueck (in Schleife) von vorne, sofern nicht stummgeschaltet
    static playMusic(sound) {
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
            AudioHub.pausedByMute = AudioHub.allSounds.filter((sound) => !sound.file.paused);
            AudioHub.stopAll();
        } else {
            AudioHub.pausedByMute.forEach((sound) => {
                sound.file.play().catch(() => {});
            });
            AudioHub.pausedByMute = [];
        }
        localStorage.setItem("muted", muted);
    }

    // Laedt den gespeicherten Mute-Status beim Spielstart
    static loadMutedState() {
        AudioHub.muted = localStorage.getItem("muted") === "true";
    }
}