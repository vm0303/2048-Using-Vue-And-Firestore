import {generateEmptyGrid} from "./BoardCreator";

export class BoardGameControls {
    constructor() {
        this.game_grid = generateEmptyGrid();
        this.nextId = 0;
        this.theScore = 0;
        this.tileCells = [];
    }

    get grid() {
        return this.game_grid;
    }

    set grid(newGrid) {
        this.game_grid = newGrid;
    }

    get availableCells() {
        return this.aLevelGrid.filter((cell) => !cell.value);
    }

    get aLevelGrid() {
        return this.game_grid.flat();
    }

    fill(count = 2) {
        for (let i = 0; i < count; i++) this.generateRandomCell();
    }

    generateRandomCell() {
        const index = this.options(this.availableCells).index;
        const cell = this.aLevelGrid[index];
        const value = Math.random() < 0.9 ? 2 : 4;
        cell.value = value;
        this.insertATile(value, index);
    }

    options(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    insertATile(value, index) {
        const tile = {value, index, delete: false, isNew: true, id: this.nextId++};
        this.tileCells.push(tile);
    }

    getTheCol(colId) {
        return this.game_grid.map((row) => row[colId]);
    }

    setTheCol(colId, col) {
        this.game_grid.forEach((row, id) => {
            row[colId] = col[id];
        });
    }

    getTheRow(rowId) {
        return [...this.game_grid[rowId]];
    }

    setTheRow(rowId, row) {
        this.game_grid[rowId] = row;
    }

    KeyArrowUp = () => {
        for (const colId in this.game_grid[0]) {
            this.moveUpAtCol(colId);
        }
    };

    keyArrowDown = () => {
        for (const colId in this.game_grid[0]) {
            this.moveDownAtCol(colId);
        }
    };

    keyArrowLeft = () => {
        for (const rowId in this.game_grid) {
            this.moveLeftAtRow(rowId);
        }
    };

    keyArrowRight = () => {
        for (const rowId in this.game_grid) {
            this.moveRightAtRow(rowId);
        }
    };

    moveUpAtCol(colId) {
        const col = this.getTheCol(colId);
        this.setTheCol(colId, this.moveTheLine(col));
    }

    moveDownAtCol(colId) {
        const col = this.getTheCol(colId).reverse();
        this.setTheCol(colId, this.moveTheLine(col).reverse());
    }

    moveLeftAtRow(rowId) {
        const row = this.getTheRow(rowId);
        this.setTheRow(rowId, this.moveTheLine(row));
    }

    moveRightAtRow(rowId) {
        const row = this.getTheRow(rowId).reverse();
        this.setTheRow(rowId, this.moveTheLine(row).reverse());
    }

    moveTheLine(line) {
        for (let i = 1; i < line.length; i++) {
            let moveToId = -1;
            if (line[i].value === 0) continue;
            for (let j = i - 1; j >= 0; j--) {
                if (
                    (line[j].value === 0 || line[j].value === line[i].value) &&
                    !line[j].changed
                )
                    moveToId = j;
                else break;
            }

            if (!~moveToId) continue;

            const cell = line[moveToId];
            const tile = this.tileCells.find((tile) => tile.index === line[i].index);
            if (cell.value) {
                cell.changed = true;
                this.mergeTheTiles(cell, tile);
            }
            cell.value += line[i].value;
            cell.moved = true;
            tile.index = cell.index;
            line[i].value = 0;
        }
        return line;
    }

    mergeTheTiles(cellTo, tileFrom) {
        const tileTo = this.tileCells.find((tile) => tile.index === cellTo.index);
        tileTo.delete = true;
        tileFrom.delete = true;
        this.insertATile(cellTo.value * 2, cellTo.index);
        this.theScore += cellTo.value * 2;
    }

    clearTheBoard() {
        for (const cell of this.aLevelGrid) {
            cell.changed = false;
            cell.moved = false;
        }
        this.tileCells = this.tileCells.filter((tile) => !tile.delete);
        this.tileCells.forEach((tile) => (tile.isNew = false));
    }

    restartGame() {
        this.nextId = 0;
        this.tileCells = [];
        this.game_grid = generateEmptyGrid();
        setTimeout(() => {
            this.fill();
        }, 0);
        this.theScore = 0;
    }

    replaceGridState({grid, tileCells, theScore, nextId}) {
        this.game_grid = grid;
        this.tileCells = tileCells;
        this.theScore = theScore;
        this.nextId = nextId ?? this.nextId;
    }

    restoreTheTiles(state) {
        this.tileCells = state.tileCells;
    }

    userLost() {
        if (this.availableCells.length) return false;
        for (let i = 0; i < this.game_grid.length; i++) {
            for (let j = 0; j < this.game_grid.length; j++) {
                const curValue = this.game_grid[i][j].value;
                if (
                    curValue === this.game_grid[i + 1]?.[j]?.value ||
                    curValue === this.game_grid[i]?.[j + 1]?.value
                )
                    return false;
            }
        }
        return true;
    }

    userWon() {
        return this.tileCells.some((tile) => tile.value === 2048);
    }
}
