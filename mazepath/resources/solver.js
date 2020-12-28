function findStartEndNodes() {
    rows = grid.length;
    cols = grid[0].length
    start = []
    end = []
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j] == "s") {
                start = [i, j]
            } else if (grid[i][j] == "e") {
                end = [i, j]
            } else if (grid[i][j] == "v") {
                grid[i][j] = 0
            }
        }
    }
    drawGrid();
    return [start, end]
}

function isOnBoard(nodePos) {
    return !(nodePos[0] > (rowCount - 1) ||
        nodePos[0] < 0 ||
        nodePos[1] > (colCount - 1) ||
        nodePos[1] < 0);
}
function isWalkable(nodePos) {
    return grid[nodePos[0]][nodePos[1]] !== "w";
}

function isValidMove(nodePos) {
    return (isOnBoard(nodePos) && isWalkable(nodePos));
}

function isValidDiagonal(pos, m) {
    let y = pos[0];
    let x = pos[1];
    let dy = m[0];
    let dx = m[1];

    if (dx === -1) {
        // top left +bottom left
        if (dy === -1) {
            return !(grid[y][x - 1] === "w" && grid[y - 1][x] === "w");
        } else {
            return !(grid[y][x - 1] === "w" && grid[y + 1][x] === "w");
        }
    } else {
        // top right + bottom right
        if (dy === -1) {
            return !(grid[y - 1][x] === "w" && grid[y][x + 1] === "w");
        } else {
            return !(grid[y + 1][x] === "w" && grid[y][x + 1] === "w");
        }
    }
}

function createGradient() {
    buff = findStartEndNodes()
    start = buff[0]
    let yDim = grid.length
    let xDim = grid[0].length
    maxSize = Math.max(xDim - start[1], yDim - start[0]) + 2
    return genGradient("#990000", "#009900", maxSize)

}

function getNeighbors(currentNode, algorithm, h, end) {
    let neighbors = [];
    let straight = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    let diagonal = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

    for (let m of straight) {
        let nodePos = [currentNode.pos[0] + m[0], currentNode.pos[1] + m[1]];

        if (!isValidMove(nodePos)) {
            continue;
        }

        let newNode = new Node(algorithm, h, currentNode, nodePos);
        if (algorithm == "astar") {
            newNode.updateValues(currentNode, end);
        }
        neighbors.push(newNode);
    }
    if (diagAllowed) {
        for (let m of diagonal) {
            let nodePos = [currentNode.pos[0] + m[0], currentNode.pos[1] + m[1]];

            if (!isValidMove(nodePos)) {
                continue;
            }

            if (!isValidDiagonal(currentNode.pos, m)) {
                continue;
            }

            let newNode = new Node(algorithm, h, currentNode, nodePos);
            if (algorithm == "astar") {
                newNode.updateValues(currentNode, end);
            }
            neighbors.push(newNode);
        }
    }
    return neighbors
}

async function pathFound(currentNode) {
    let path = [];
    let curr = currentNode;
    while (curr != null) {
        path.push(curr.pos);
        curr = curr.parent;
    }

    await drawPath(path)
}

async function drawPath(path) {
    for (var i = 1; i < path.length - 1; i++) {
        cp = path[i]
        node = document.getElementById(`${cp[0]}_${cp[1]}`)
        node.style.background = `#FFFFFF`
        if (delay > 50) {
            $(`#${cp[0]}_${cp[1]}`).removeClass("scaleInFast").addClass("scaleInFast");
        } else {
            $(`#${cp[0]}_${cp[1]}`).removeClass("scaleInFast").addClass("scaleInFast");
        }
        await sleep(delay)
    }

}

async function updateViz(cp, gradient, start) {
    val = Math.max(Math.abs(cp[0] - start[0]), Math.abs(cp[1] - start[1])) - 1
    if (val >= gradient.length) {
        val = gradient.length - 1
    }
    node = document.getElementById(`${cp[0]}_${cp[1]}`)
    node.style.background = `${gradient[val]}`
    if (delay > 50) {
        $(`#${cp[0]}_${cp[1]}`).removeClass("scaleInFast").addClass("scaleInFast");
    } else {
        $(`#${cp[0]}_${cp[1]}`).removeClass("scaleInFast").addClass("scaleInFast");
    }
}

async function aStar(algorithm, h) {
    gradient = createGradient();

    buff = findStartEndNodes()
    rowCount = grid.length
    colCount = grid[0].length
    let s = buff[0]
    let e = buff[1]

    if (s.length == 0 || e.length == 0) {
        alert("Please place a start and end node")
        return;
    }

    let start = new Node(algorithm, h, null, s);
    let end = new Node(algorithm, h, null, e);

    let open = [];
    let closed = [];

    open.push(start);
    let loopCount = 0;
    const maxLoopCount = Math.pow(rowCount / 2, 10);

    while (open.length > 0 && loopCount < maxLoopCount) {
        if (!contSolve) {
            return;
        }
        loopCount++;
        let currentNode = open[0];
        let currentIndex = 0;



        for (let i = 0; i < open.length; i++) {
            if (open[i].f < currentNode.f) {
                currentNode = open[i];
                currentIndex = i;
            }
        }


        open.splice(currentIndex, 1);
        closed.push(currentNode);

        if (currentNode.isEqual(end)) {
            await pathFound(currentNode)
            return;
        }

        let neighbors = getNeighbors(currentNode, algorithm, h, end)
        for (let node of neighbors) {
            if (!node.isEqual(start) && !node.isEqual(end)) {
                let cp = node.pos;
                if (grid[cp[0]][cp[1]] === 0) {
                    await updateViz(cp, gradient, start.pos)
                    await sleep(delay)
                    grid[cp[0]][cp[1]] = "v";
                }
            }

            if (closed.some(e => e.isEqual(node))) {
                continue;
            }

            if (!open.some(e => e.isEqual(node))) {
                open.push(node)
            } else {
                let index = open.findIndex(e => e.isEqual(node));

                if (open[index].f > node.f) {
                    open[index] = node;
                }
            }
        }
    }
    return;
}

async function bfs() {
    algorithm = "bfs"
    gradient = createGradient();

    buff = findStartEndNodes()
    rowCount = grid.length
    colCount = grid[0].length
    s = buff[0]
    e = buff[1]
    if (s.length == 0 || e.length == 0) {
        alert("Please place a start and end node")
        return;
    }

    let start = new Node(algorithm, null, null, buff[0]);
    let end = new Node(algorithm, null, null, buff[1]);
    let open = [];
    let closed = [];
    open.push(start);

    while (open.length > 0) {
        if (!contSolve) {
            return;
        }
        let currentNode = open.shift();
        closed.push(currentNode);

        if (currentNode.isEqual(end)) {
            await pathFound(currentNode)
            return;
        }

        let neighbors = getNeighbors(currentNode, algorithm, null, end)
        for (let node of neighbors) {
            if (!node.isEqual(start) && !node.isEqual(end)) {
                let cp = node.pos;
                if (grid[cp[0]][cp[1]] === 0) {
                    await updateViz(cp, gradient, start.pos)
                    await sleep(delay)
                    grid[cp[0]][cp[1]] = "v";
                }
            }


            if (closed.some(e => e.isEqual(node)) || open.some(e => e.isEqual(node))) {
                continue;
            }

            node.parent = currentNode;
            open.push(node);
        }
    }

    return;
}

async function dfs() {
    function contains(arr, node) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].isEqual(node)) {
                return true
            }
        }
        return false;
    }
    function check() {
        let yDim = grid.length
        let xDim = grid[0].length
        cnt = 0
        walls = 0
        for (var i = 0; i < yDim; i++) {
            for (var j = 0; j < xDim; j++) {
                if (grid[i][j] == "w") {
                    walls++
                }
                cnt++
            }
            if (walls / cnt < .5) {
                msg = "Depth First Search works best when the search space is finite. Continue ?"
                ans = confirm(msg)
                if (ans) {
                    return true
                } else {
                    return false
                }
            }
        }
        return true;

    }
    algorithm = "dfs"
    gradient = createGradient();

    buff = findStartEndNodes()
    rowCount = grid.length
    colCount = grid[0].length
    s = buff[0]
    e = buff[1]
    if (s.length == 0 || e.length == 0) {
        alert("Please place a start and end node")
        return;
    }
    if (!check()) {
        return
    }


    let start = new Node(algorithm, null, null, buff[0]);
    let end = new Node(algorithm, null, null, buff[1]);
    let stack = new Stack();
    stack.push(start)
    let visited = []
    while (!stack.empty()) {
        if (!contSolve) {
            return;
        }
        const currentNode = stack.pop();
        if (currentNode == end) {
            break
        }
        currentNode.visited = true;
        visited.push(currentNode)

        let neighbors = getNeighbors(currentNode, algorithm, null, end)

        for (let node of neighbors) {
            if (!node.isEqual(start) && !node.isEqual(end) && !contains(visited, node)) {
                let cp = node.pos;
                if (grid[cp[0]][cp[1]] === 0) {
                    await updateViz(cp, gradient, start.pos)
                    await sleep(delay)
                    grid[cp[0]][cp[1]] = "v";
                    stack.push(node)
                }
            } else if (node.isEqual(start) || node.isEqual(end)) {
                node.parent = currentNode
                stack.push(node)
                if (node.isEqual(end)) {
                    await pathFound(node)
                    return;
                }
            }
        }

    }
    return;
}

