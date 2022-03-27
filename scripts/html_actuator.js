'use strict';
class HTMLActuator {
    static HIDE_CURRENT_TURN = false;
    static PUNISH_BLIND_MOVES = false;
    static LETTER_SCORE = {
        "a": 1, "b": 3, "c": 3, "d": 2, "e": 1,
        "f": 4, "g": 2, "h": 4, "i": 1, "j": 8,
        "k": 5, "l": 1, "m": 3, "n": 1, "o": 1,
        "p": 3, "qu": 10, "r": 1, "s": 1, "t": 1,
        "u": 1, "v": 4, "w": 4, "x": 8, "y": 4, "z": 10
    };
    tileContainer;
    gameContainer;
    wordConstructContainer;
    calculationContainer;
    scoreTotalContainer;
    turnsContainer;
    recentScore;
    turnMaxScore;
    totalScore;
    constructor() {
        this.tileContainer = document.getElementsByClassName("tile-container")[0];
        this.gameContainer = document.getElementsByClassName("game-container")[0];
        this.wordConstructContainer = document.getElementsByClassName("word-construct-container")[0];
        this.calculationContainer = document.getElementsByClassName("calculation-container")[0];
        this.scoreTotalContainer = document.getElementsByClassName("score-total-container")[0];
        this.turnsContainer = document.getElementsByClassName("turns-container")[0];
        this.recentScore = 0;
        this.turnMaxScore = 0;
        this.totalScore = 0;
    }
    actuate_grid(grid) {
        window.requestAnimationFrame(() => {
            this.clearContainer();
            grid.cells.forEach((column) => {
                column.forEach((cell) => {
                    if (cell) {
                        this.addHTMLTile(cell);
                    }
                });
            });
        });
    }
    clearContainer() {
        while (this.tileContainer.firstChild) {
            this.tileContainer.removeChild(this.tileContainer.firstChild);
        }
    }
    addHTMLTile(tile) {
        const element = document.createElement("div");
        function pos_offset(pos, offset) { return { x: pos.x + offset, y: pos.y + offset }; }
        function tile_pos_attr(pos) { return "tile-position-" + pos.x + "-" + pos.y; }
        const pos_jsobj = pos_offset(tile.prevPos || tile.pos, 1);
        element.classList.add("tile", "tile-" + tile.value, tile_pos_attr(pos_jsobj));
        if (tile.bonus)
            element.classList.add(tile.bonus);
        element.textContent = tile.value.toUpperCase();
        if (element.textContent == "QU")
            element.textContent = "Qu";
        element.setAttribute("draggable", "true");
        const tileScore = document.createElement("div");
        tileScore.classList.add("tileScore");
        tileScore.textContent = HTMLActuator.LETTER_SCORE[tile.value].toString();
        element.appendChild(tileScore);
        this.tileContainer.appendChild(element);
        window.requestAnimationFrame(() => {
            element.classList.remove(element.classList[2]);
            element.classList.add(tile_pos_attr(pos_offset(tile.pos, 1)));
        });
        if (tile.prevPos.y > 4) {
            element.classList.add("tile-new");
        }
        element.addEventListener("dragstart", tile.dragstart_handler.bind(tile));
        element.addEventListener("dragenter", tile.dragenter_handler.bind(tile));
        // element.addEventListener("dragleave",tile.dragleave_handler.bind(tile));
        element.addEventListener("dragend", tile.dragend_handler.bind(tile));
        element.addEventListener("dragover", tile.dragover_handler.bind(tile));
        element.addEventListener("drop", tile.drop_handler.bind(tile));
        element.addEventListener("mousedown", tile.mousedown_handler.bind(tile));
        element.addEventListener("mouseup", tile.mouseup_handler.bind(tile));
        element.addEventListener("contextmenu", tile.contextmenu_handler.bind(tile));
    }
    actuate_word(tiles, validity) {
        while (this.wordConstructContainer.firstChild) {
            this.wordConstructContainer.removeChild(this.wordConstructContainer.firstChild);
        }
        this.wordConstructContainer.classList.remove("finish-select");
        if (validity)
            this.wordConstructContainer.classList.replace("invalid", "valid");
        else
            this.wordConstructContainer.classList.replace("valid", "invalid");
        tiles.forEach((tile) => {
            const tilecopy = tile.cloneNode(true);
            tilecopy.removeChild(tilecopy.firstElementChild);
            tilecopy.classList.add("construct");
            this.wordConstructContainer.appendChild(tilecopy);
        });
    }
    finishSelect(validity) {
        this.applyScore(validity);
        this.wordConstructContainer.classList.add("finish-select");
    }
    actuate_calc(pure_score, letter_bonus, word_bonus) {
        while (this.calculationContainer.firstChild) {
            this.calculationContainer.removeChild(this.calculationContainer.firstChild);
        }
        this.calculationContainer.textContent = "(" + pure_score + " + " + letter_bonus + ") * " + word_bonus
            + " = ";
        const element = document.createElement("strong");
        this.recentScore = (pure_score + letter_bonus) * word_bonus;
        if (this.recentScore > this.turnMaxScore)
            this.turnMaxScore = this.recentScore;
        element.textContent = (this.recentScore).toString();
        this.calculationContainer.appendChild(element);
    }
    setScore(score) {
        this.scoreTotalContainer.textContent = score.toString();
        this.totalScore = score;
    }
    applyScore(validity) {
        if (validity)
            this.totalScore = this.totalScore + this.recentScore;
        else if (HTMLActuator.PUNISH_BLIND_MOVES)
            this.totalScore -= this.turnMaxScore / 2;
        this.turnMaxScore = 0;
        this.scoreTotalContainer.textContent = this.totalScore.toString();
    }
    gameOver() {
        this.gameContainer.classList.add("game-over");
    }
    remove_gameOver() {
        this.gameContainer.classList.remove("game-over");
    }
    showTurn(turns, maxturn) {
        if (HTMLActuator.HIDE_CURRENT_TURN)
            turns = "--";
        console.log("turns: " + turns);
        this.turnsContainer.textContent = "" + turns + " / " + maxturn;
    }
    loaded() {
        const loading = document.getElementsByClassName("loading")[0];
        loading.classList.add("loaded");
    }
    showValidity(bool = true) {
        if (bool)
            this.wordConstructContainer.classList.remove("hide-validity");
        else
            this.wordConstructContainer.classList.add("hide-validity");
    }
}
//# sourceMappingURL=html_actuator.js.map