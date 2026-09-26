export const generationPosition = (lato) => {
    const toRet = [];
    let currentRow = 0;
    for (let i = 0; i < lato * lato; i++) {
        if (i % lato == 0) {
            currentRow++;
        }
        toRet.push([i % lato * 2.1, currentRow * 2.1, 0])
    }
    return toRet;
}

export const generationMatrix = (lato) => {
    const newMatrix = []
    for (let x = 0; x < lato; x++) {
        newMatrix[x] = [];
        for (let y = 0; y < lato; y++) {
            newMatrix[x][y] = false;
        }
    }
    return newMatrix;
}

function getNeighborhood(x, y, lato) {
    let n, ne, e, se, s, sw, w, nw;
    n = null;
    ne = null;
    e = null;
    se = null;
    s = null;
    sw = null;
    w = null;
    nw = null;
    if (x != 0) {
        w = [x - 1, y];
        sw = [x - 1, y - 1];
        nw = [x - 1, y + 1];
    }
    if (x != lato - 1) {
        e = [x + 1, y];
        ne = [x + 1, y + 1];
        se = [x + 1, y - 1];
    }
    if (y != 0) {
        s = [x, y - 1];
    }
    if (y != lato - 1) {
        n = [x, y + 1];
    }
    return [n, ne, e, se, s, sw, w, nw]
}

function isLive(cell, matrix) {
    if (cell === null) {
        return false;
    }
    return matrix[cell[0]][cell[1]];
}

export function simulation(x, y, matrix, lato, customRule) {
    const { underpopulated, stable, birth, overpopulated, neigh } = customRule;
    let numberAlive = 0;
    const neighborhood = neigh == "VN" ? getNeighborhoodVN(x, y, lato) : getNeighborhood(x, y, lato)
    for (let cell of neighborhood) {
        if (isLive(cell, matrix)) {
            numberAlive++;
        }
    }
    const alive = isLive([x, y], matrix)
    if (Array.isArray(underpopulated)) {
        if (alive && numberAlive > underpopulated[0] && numberAlive < underpopulated[1]) return false;
    } else {
        if (alive && numberAlive < underpopulated) return false;
    }
    if (Array.isArray(stable)) {
        if (alive && numberAlive > stable[0] && numberAlive < stable[1]) return true;
    } else {
        if (alive && (numberAlive == stable)) return true;
    }
    if (Array.isArray(birth)) {
        if (numberAlive > birth[0] && numberAlive < birth[1]) return true;
    } else {
        if ((numberAlive == birth)) return true;
    }
    if (Array.isArray(overpopulated)) {
        if (alive && numberAlive > overpopulated[0] && numberAlive < overpopulated[1]) return false;
    } else {
        if (alive && numberAlive > overpopulated) return false;
    }
    return false;
}

function getNeighborhoodVN(x, y, lato) {
    let e = null;
    let w = null;
    let n = null;
    let s = null;

    if (x != 0) w = [x - 1, y];
    if (x != lato - 1) e = [x + 1, y];
    if (y != 0) s = [x, y - 1];
    if (y != lato - 1) n = [x, y + 1];
    return [e, w, n, s];

}
// Any live cell with fewer than two live neighbors dies as if caused by underpopulation.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any live cell with more than three live neighbors dies as if by overpopulation.
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

export function currentPoint(matrix, index, lato) {
    if (matrix.length < lato) return false;
    return matrix[index % lato][Math.floor(index / lato) % lato];
}

export function runSimulation(lato, Matrix, customRule) {
    let newMatrix = []
    for (let x = 0; x < lato; x++) {
        newMatrix[x] = [];
        for (let y = 0; y < lato; y++) {
            newMatrix[x][y] = simulation(x, y, Matrix, lato, customRule);
        }
    }
    return newMatrix
}
export const generationRandomMatrix = (lato) => {
    const newMatrix = [];
    for (let x = 0; x < lato; x++) {
        newMatrix[x] = [];
        for (let y = 0; y < lato; y++) {
            newMatrix[x][y] = Math.random() < 0.5 ? true : false;
        }
    }
    return newMatrix;
};