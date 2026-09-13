/**
 * Central registry for all setInterval timers in the game, so they can all
 * be stopped at once (for example when the game ends or restarts).
 * @class
 */
export class IntervalHub {
    /**
     * All currently registered interval IDs.
     * @type {number[]}
     */
    static allIntervals = [];

    /**
     * Starts a new interval and registers it so it can be stopped later.
     * @param {Function} func - The function to run repeatedly.
     * @param {number} timer - The interval time in milliseconds.
     */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
    }

    /**
     * Stops every registered interval and clears the registry.
     */
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}