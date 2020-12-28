function updateDim() {

    // Getting slider
    slider = document.getElementById("sizeDim")
    // Getting Span with numeric val
    numVal = document.getElementById("sizeVal")
    // Seting numeric val
    numVal.innerHTML = slider.value;
}

function updateDelay() {
    slider = document.getElementById("delaySlider")
    document.getElementById("delayVal").innerHTML = slider.value
    delay = eval(slider.value)
}

function updateDiagAllow() {
    buff = document.getElementById("diag")
    if (diagAllowed) {
        diagAllowed = false
        buff.style.background = "var(--darkblue)"
        buff.style.color = "white"
        buff.innerHTML = "<s>Diagonals</s>"
    } else {
        diagAllowed = true;
        buff.style.background = "var(--green)"
        buff.style.color = "black"
        buff.innerHTML = "Diagonals"

    }
}


function closeInfo() {
    info = document.getElementById("infoBox")
    info.style.display = "none"
}

function openInfo() {
    info = document.getElementById("infoBox")
    info.style.display = "block"
}


function makeDragable(dragHandle, dragTarget) {
    let dragObj = null; //object to be moved
    let xOffset = 0; //used to prevent dragged object jumping to mouse location
    let yOffset = 0;

    document.querySelector(dragHandle).addEventListener("mousedown", startDrag, true);
    document.querySelector(dragHandle).addEventListener("touchstart", startDrag, true);

    /*sets offset parameters and starts listening for mouse-move*/
    function startDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        dragObj = document.querySelector(dragTarget);
        dragObj.style.position = "absolute";
        let rect = dragObj.getBoundingClientRect();

        if (e.type == "mousedown") {
            xOffset = e.clientX - rect.left; //clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
            yOffset = e.clientY - rect.top;
            window.addEventListener('mousemove', dragObject, true);
        } else if (e.type == "touchstart") {
            xOffset = e.targetTouches[0].clientX - rect.left;
            yOffset = e.targetTouches[0].clientY - rect.top;
            window.addEventListener('touchmove', dragObject, true);
        }
    }

    /*Drag object*/
    function dragObject(e) {
        e.preventDefault();
        e.stopPropagation();

        if (dragObj == null) {
            return; // if there is no object being dragged then do nothing
        } else if (e.type == "mousemove") {
            dragObj.style.left = e.clientX - xOffset + "px"; // adjust location of dragged object so doesn't jump to mouse position
            dragObj.style.top = e.clientY - yOffset + "px";
        } else if (e.type == "touchmove") {
            dragObj.style.left = e.targetTouches[0].clientX - xOffset + "px"; // adjust location of dragged object so doesn't jump to mouse position
            dragObj.style.top = e.targetTouches[0].clientY - yOffset + "px";
        }
    }

    /*End dragging*/
    document.onmouseup = function (e) {
        if (dragObj) {
            dragObj = null;
            window.removeEventListener('mousemove', dragObject, true);
            window.removeEventListener('touchmove', dragObject, true);
        }
    }
}


// Graph node changes 
async function initializeCells() {
    async function updateCell(cell, color) {
        cell.css("background", color)
        cell.removeClass("scaleInFast").addClass("scaleInFast");
    }
    $('td').on("mouseover", function (event) {
        if (m1) {
            let row = $(this).attr("row")
            let col = $(this).attr("col")
            grid[row][col] = "w"
            updateCell($(this), "black")
        } else if (spaceDown) {
            let row = $(this).attr("row")
            let col = $(this).attr("col")
            grid[row][col] = 0
            updateCell($(this), "var(--cell)")

        }
    })
    // Clickable actions
    $('td').click(function (event) {
        let row = $(this).attr("row")
        let col = $(this).attr("col")
        if (event.shiftKey) {
            start = pointExists("s")
            if (!start) {
                grid[row][col] = 's'
                updateCell($(this), "green")
            } else {
                // if has start returns dims, 
                i = start[0]
                j = start[1]
                grid[i][j] = 0
                if (i == row && j == col) {
                    updateCell($(this), "var(--cell)")
                } else {
                    grid[row][col] = 's'
                    updateCell($(`#${i}_${j}`), "var(--cell)")
                    updateCell($(this), "green")
                }
            }
        } else if (event.ctrlKey) {
            end = pointExists("e")
            if (!end) {
                grid[row][col] = 'e'
                updateCell($(this), "red")
            } else {
                // if has start returns dims, 
                i = end[0]
                j = end[1]
                grid[i][j] = 0
                if (i == row && j == col) {
                    updateCell($(this), "var(--cell)")

                } else {
                    grid[row][col] = 'e'
                    updateCell($(`#${i}_${j}`), "var(--cell)")
                    updateCell($(this), "red")
                }
            }
        } else {
            wall = pointExists("w")
            if (wall) {
                grid[row][col] = 0
                updateCell($(this), "var(--cell)")
            } else {
                console.log("HI")
                grid[row][col] = "w"
                updateCell($(this), "black")
            }
        }
    });
}

function pointExists(label) {
    rows = grid.length
    cols = grid[0].length
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j] == label) {
                return [i, j]
            }
        }
    }
    return false;
}





