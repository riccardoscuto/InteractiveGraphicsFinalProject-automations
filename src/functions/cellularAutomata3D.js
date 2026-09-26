export const generationPosition = (lato) => {
    const toRet = [];
    for (let j = 0; j < lato; j++) {
        toRet[j] = []
        let currentRow = 0;
        for (let i = 0; i < lato * lato; i++) {
            if (i % lato == 0) {
                currentRow++;
            }
            toRet[j].push([(i % lato) * 2.5, j * 2.5, currentRow * 2.5]);
        }
    }
    return toRet;
};

export const generationMatrix = (lato) => {
    const newMatrix = [];
    for (let x = 0; x < lato; x++) {
        newMatrix[x] = [];
        for (let y = 0; y < lato; y++) {
            newMatrix[x][y] = [];
            for (let z = 0; z < lato; z++) {
                newMatrix[x][y][z] = false;
            }
        }
    }
    return newMatrix;
};

export const generationRandomMatrix = (lato) => {
    const newMatrix = [];
    for (let x = 0; x < lato; x++) {
        newMatrix[x] = [];
        for (let y = 0; y < lato; y++) {
            newMatrix[x][y] = [];
            for (let z = 0; z < lato; z++) {
                newMatrix[x][y][z] = Math.random() < 0.3 ? true : false;
            }
        }
    }
    return newMatrix;
};


function getNeighborhood(x, y, z, lato) {
    let e = null
    let w = null
    let n = null
    let s = null
    let t = null
    let b = null
    let ne = null
    let se = null
    let nw = null
    let sw = null
    let et = null
    let eb = null
    let wt = null
    let wb = null
    let nt = null
    let nb = null
    let st = null
    let sb = null
    let net = null
    let neb = null
    let set = null
    let seb = null
    let nwt = null
    let nwb = null
    let swt = null
    let swb = null

    if (x != 0) w = [x - 1, y, z]; //si
    if (x != 0 && y != 0) sw = [x - 1, y - 1, z];
    if (x != 0 && y != lato - 1) nw = [x - 1, y + 1, z];
    if (x != 0 && z != lato - 1) wt = [x - 1, y, z + 1]
    if (x != 0 && z != 0) wb = [x - 1, y, z - 1]
    if (x != 0 && y != lato - 1 && z != lato - 1) nwt = [x - 1, y + 1, z + 1]
    if (x != 0 && y != lato - 1 && z != 0) nwb = [x - 1, y + 1, z - 1]
    if (x != 0 && y != 0 && z != lato - 1) swt = [x - 1, y - 1, z + 1]
    if (x != 0 && y != 0 && z != 0) swb = [x - 1, y - 1, z - 1]
    if (x != lato - 1) e = [x + 1, y, z]; //ok
    if (x != lato - 1 && y != lato - 1) ne = [x + 1, y + 1, z];
    if (x != lato - 1 && y != 0) se = [x + 1, y - 1, z];
    if (x != lato - 1 && y != lato - 1 && z != 0) neb = [x + 1, y + 1, z - 1];
    if (x != lato - 1 && y != 0 && z != lato - 1) set = [x + 1, y - 1, z + 1];
    if (x != lato - 1 && y != 0 && z != 0) seb = [x + 1, y - 1, z - 1];
    if (y != 0) s = [x, y - 1, z]; //si
    if (y != 0 && z != lato - 1) st = [x, y - 1, z + 1];
    if (y != 0 && z != 0) sb = [x, y - 1, z - 1];
    if (y != lato - 1) n = [x, y + 1, z]; //si
    if (y != lato - 1 && z != lato - 1) nt = [x, y + 1, z + 1];
    if (y != lato - 1 && z != 0) nb = [x, y + 1, z - 1];
    if (z != 0) b = [x, y, z - 1];
    if (z != lato - 1) t = [x, y, z + 1]
    if (x != lato - 1 && z != lato - 1) et = [x + 1, y, z + 1];
    if (x != lato - 1 && z != 0) eb = [x + 1, y, z - 1];
    if (x != lato - 1 && z != lato - 1 && y != lato - 1) net = [x + 1, y + 1, z + 1];

    return [e, w, n, s, t, b, ne, se, nw, sw, et, eb, wt, wb, nt, nb, st, sb, net, neb, set, seb, nwt, nwb, swt, swb];
}

function getNeighborhoodVN(x, y, z, lato) {
    let e = null;
    let w = null;
    let n = null;
    let s = null;
    let t = null;
    let b = null;
    if (x != 0) w = [x - 1, y, z];
    if (x != lato - 1) e = [x + 1, y, z];
    if (y != 0) s = [x, y - 1, z];
    if (y != lato - 1) n = [x, y + 1, z];
    if (z != 0) b = [x, y, z - 1];
    if (z != lato - 1) t = [x, y, z + 1];
    return [e, w, n, s, t, b];
}

function isLive(cell, matrix) {
    if (cell === null) {
        return false;
    }
    return matrix[cell[0]][cell[1]][cell[2]];
}
export function simulation(x, y, z, matrix, lato) {
    let numberAlive = 0;
    for (let cell of getNeighborhood(x, y, z, lato)) {
        if (isLive(cell, matrix)) {
            numberAlive++;
        }
    }
    const alive = isLive([x, y, z], matrix)
    if (alive && numberAlive < 2) return false;
    if (alive && (numberAlive == 3 || numberAlive == 2)) return true;
    if (alive && numberAlive > 3) return false;
    if (!alive && numberAlive == 3) return true;
    return false;
}
export function currentPoint(matrix, index, lato) {
    if (matrix.length < lato) return false;

    return matrix[index % lato][Math.floor(index / lato) % lato][Math.floor(index / (lato * lato))];

}
export function simulationCustomRule(x, y, z, matrix, lato, customRule) {
    const { underpopulated, stable, birth, overpopulated, neigh, alwaysAlive } = customRule;
    let numberAlive = 0;
    const neighborhood = neigh == "VN" ? getNeighborhoodVN(x, y, z, lato) : getNeighborhood(x, y, z, lato)
    for (let cell of neighborhood) {
        if (isLive(cell, matrix)) {
            numberAlive++;
        }
    }
    const alive = isLive([x, y, z], matrix)
    if (alwaysAlive && alive) return true;
    if (Array.isArray(underpopulated)) {
        if (alive && numberAlive > underpopulated[0] && numberAlive < underpopulated[1]) return false;
    } else {
        if (alive && numberAlive < underpopulated) return false;
    }
    if (Array.isArray(stable)) {
        if (alive && numberAlive >= stable[0] && numberAlive <= stable[1]) return true;
    } else {
        if (alive && (numberAlive == stable)) return true;
    }
    if (Array.isArray(birth)) {
        if (numberAlive >= birth[0] && numberAlive <= birth[1]) return true;
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
export function runSimulation(lato, Matrix, customRule) {
    const { underpopulated, stable, birth, overpopulated, neigh } = customRule;
    let newMatrix = []
    for (let x = 0; x < lato; x++) {
        newMatrix[x] = [];
        for (let y = 0; y < lato; y++) {
            newMatrix[x][y] = [];
            for (let z = 0; z < lato; z++) {
                newMatrix[x][y][z] = simulationCustomRule(x, y, z, Matrix, lato, customRule);
            }
        }
    }
    return newMatrix
}