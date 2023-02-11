const generateCell = (index) => ({
    value: 0,
    changed: false,
    moved: false,
    index,
});

const GRID = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

export const generateEmptyGrid = () => {
    let index = 0;
    return GRID.map((row) => row.map(() => generateCell(index++)));
};
