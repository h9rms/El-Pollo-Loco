/**
 * Wraps a single HTML audio element together with optional volume and loop settings.
 * @class
 */
class MyAudio {
    file;
    isLoaded;

    /**
     * Creates a new MyAudio instance.
     * @param {string} _file - The path to the audio file.
     * @param {Object} [options] - Optional playback settings.
     * @param {number} [options.volume] - The playback volume, between 0 and 1.
     * @param {boolean} [options.loop] - True if the audio should loop automatically.
     */
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

/**
 * Central place for every sound used in the game, plus the logic to play,
 * stop and mute them.
 * @class
 */
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

    /** @type {MyAudio[]} Every sound defined above, used for muting and stopping all at once. */
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

    /**
     * Plays a single sound from the start, unless the game is muted.
     * @param {MyAudio} sound - The sound to play.
     */
    static playOne(sound) {
        if (AudioHub.muted) {
            return;
        }
        sound.file.currentTime = 0;
        sound.file.play().catch(() => {});
    }

    /**
     * Starts a looping music track from the beginning, unless the game is muted.
     * @param {MyAudio} sound - The music track to play.
     */
    static playMusic(sound) {
        if (AudioHub.muted) {
            return;
        }
        sound.file.currentTime = 0;
        sound.file.play().catch(() => {});
    }

    /**
     * Pauses every sound in the game.
     */
    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.file.pause();
        });
    }

    /**
     * Pauses a single sound.
     * @param {MyAudio} sound - The sound to pause.
     */
    static stopOne(sound) {
        sound.file.pause();
    }

    /**
     * Mutes or unmutes the game, remembering which sounds were actively
     * playing so they can be resumed later, and saves the choice to local storage.
     * @param {boolean} muted - True to mute the game, false to unmute it.
     */
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

    /**
     * Loads the previously saved mute state from local storage.
     */
    static loadMutedState() {
        AudioHub.muted = localStorage.getItem("muted") === "true";
    }
}