export const Storage = {
    getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    setToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get history() {
        return this.getFromLocalStorage("2048-history") || [];
    },

    set history(value) {
        this.setToLocalStorage("2048-history", value);
    },

    get maxScore() {
        return this.getFromLocalStorage("2048-max-score") || 0;
    },

    set maxScore(value) {
        this.setToLocalStorage("2048-max-score", value);
    },

    get hasWon() {
        return this.getFromLocalStorage("2048-won");
    },

    set hasWon(value) {
        this.setToLocalStorage("2048-won", value);
    },
};
