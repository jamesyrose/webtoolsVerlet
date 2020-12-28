var grid = []
var m1 = false;
var spaceDown = false;
var delay = 25;
var diagAllowed = false;
contSolve = true;

window.onload = function () {
    createGrid();
    drawGrid();
    makeDragable('#handle', '#moveable')

}

window.addEventListener('resize', function () {
    drawGrid()
})

async function solve() {
    running();
    selection = document.getElementById("method").value
    if (selection == 1) {
        await aStar("astar", 0)
    } else if (selection == 2) {
        await aStar("astar", 1)
    } else if (selection == 3) {
        await aStar("djistra", 0)
    } else if (selection == 4) {
        await bfs()
    } else if (selection == 5) {
        await dfs()
    }
    stopRunning();

}

function running() {
    contSolve = true;
    inputs = document.getElementById("inputs")
    inputs.style.display = "none";
    stop = document.getElementById("stopBtn")
    stop.style.display = "block"

}

function stopRunning(clicked = false) {
    contSolve = false
    inputs = document.getElementById("inputs")
    inputs.style.display = "block";
    stop = document.getElementById("stopBtn")
    stop.style.display = "none"
    if (clicked) {

    }
}

function createGrid() {
    // Initialize grid of 0's
    let windowHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    let windowWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    let yDim = eval(document.getElementById("sizeDim").value)
    let xDim = Math.floor(yDim / windowHeight * windowWidth)

    buff = []
    for (var i = 0; i < yDim; i++) {
        buff.push(new Array(xDim).fill(0));
    }
    grid = buff;
    drawGrid();
}

function drawGrid() {
    let section = document.getElementById("maze")
    let header = document.getElementById("header")
    let windowHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    let windowWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    rows = grid.length
    cols = grid[0].length

    headerBounds = header.getBoundingClientRect()
    section.style.top = `${headerBounds.height}px`;

    xNode = Math.round(windowWidth / cols * 1e6) / 1e6
    yNode = Math.round((windowHeight - headerBounds.height) / rows * 1e6) / 1e6


    html = ""
    for (var i = 0; i < rows; i++) {
        html += `<tr style="width: 100%; height: ${yNode}px">`
        for (var j = 0; j < cols; j++) {
            buff = grid[i][j]
            if (buff == "w") {
                html += `<td id="${i}_${j}"  row=${i} col=${j} 
                style="width: ${xNode}px; background: black"></td>`
            } else if (buff == "s") {
                html += `<td id="${i}_${j}"  row=${i} col=${j} 
                style="width: ${xNode}px; background: green"></td>`
            } else if (buff == "e") {
                html += `<td id="${i}_${j}"  row=${i} col=${j} 
                style="width: ${xNode}px; background: red"></td>`
            } else {
                html += `<td id="${i}_${j}"  row=${i} col=${j} 
                style="width: ${xNode}px;"></td>`
            }
        }
        html += "</tr>"
    }
    document.getElementById("maze").innerHTML = html
    initializeCells()
}

async function rndMaze() {
    // Uses dfs to generate random maze
    function isOnBoard(nodePos) {
        return !(nodePos[0] > (rows - 1) ||
            nodePos[0] < 0 ||
            nodePos[1] > (cols - 1) ||
            nodePos[1] < 0);
    }
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    async function updateCellColor(i, j, color, multi = 1) {
        document.getElementById(`${i}_${j}`).style.background = color
        $(`#${i}_${j}`).removeClass("scaleIn").addClass("scaleIn");
        await sleep(((delay > 50) ? 25 : 5) * multi)
    }
    createGrid()

    rows = grid.length;
    cols = grid[0].length

    for (let i = 0; i < rows; i += 2) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = "w";
            await updateCellColor(i, j, "black")

        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j += 2) {
            grid[i][j] = "w";
            await updateCellColor(i, j, "black")
        }
    }

    // Starting point 
    let x = 1
    let y = 1
    let stack = []

    grid[x][y] = "v";
    stack.push([y, x])

    while (stack.length > 0) {
        let e = stack.pop();
        let neighbors = [];
        let moves = [[0, -2], [0, 2], [-2, 0], [2, 0]];

        for (let m of moves) {
            let nodePos = [e[0] + m[0], e[1] + m[1]];

            if (!isOnBoard(nodePos) || grid[nodePos[0]][nodePos[1]] === "v") {
                continue;
            }
            neighbors.push(nodePos);
        }

        if (neighbors.length > 0) {
            stack.push(e);
            let randNeighbor = shuffle(neighbors)[0];

            if (randNeighbor[0] === e[0]) { // Same row
                if (randNeighbor[1] > e[1]) {
                    grid[e[0]][e[1] + 1] = 0;
                    await updateCellColor(e[0], e[1] + 1, "var(--cell)", multi = 4)
                } else {
                    grid[e[0]][e[1] - 1] = 0;
                    await updateCellColor(e[0], e[1] - 1, "var(--cell)", multi = 4)
                }
            } else { // Same column
                if (randNeighbor[0] > e[0]) {
                    grid[e[0] + 1][e[1]] = 0;
                    await updateCellColor(e[0] + 1, e[1], "var(--cell)", multi = 4)
                } else {
                    grid[e[0] - 1][e[1]] = 0;
                    await updateCellColor(e[0] - 1, e[1], "var(--cell)", multi = 4)
                }
            }
            grid[randNeighbor[0]][randNeighbor[1]] = "v";
            stack.push(randNeighbor);
        }
    }

    let emptyPoints = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === "v") {
                grid[i][j] = 0;
                await updateCellColor(i, j, "var(--cell)")
                emptyPoints.push([i, j])
            }
        }
    }
    // Start and end
    emptySize = emptyPoints.length
    buff = emptyPoints[getRandomArbitrary(0, Math.floor(emptySize / 4))]
    grid[buff[0]][buff[1]] = "s";
    await updateCellColor(buff[0], buff[1], "green", multi = 4)
    buff = emptyPoints[getRandomArbitrary(Math.floor(emptySize / 4) * 3, emptySize - 1)]
    grid[buff[0]][buff[1]] = "e";
    await updateCellColor(buff[0], buff[1], "red", multi = 4)

    // drawGrid();
}

function sleep(ms) {
    if (ms < 1) {
        ms = 1;
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

// JQuery Things
$(document).mousedown(function () {
    m1 = true;
}).mouseup(function () {
    m1 = false;
});

$(document).keyup(function (evt) {
    if (evt.keyCode == 32) {
        spaceDown = false;
    }
}).keydown(function (evt) {
    if (evt.keyCode == 32) {
        spaceDown = true;
    }
});

