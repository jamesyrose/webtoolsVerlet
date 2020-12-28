var array = [];
var currentlySorting = false;


var delay = 0;
var iter = [0]
var multiplier = 1;

window.onload = function () {
    delay = document.getElementById("delay-slider").value;
    rndArray();
    setDim();
    timeComplexity()
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        warning();
    }

    makeDragable('#handle', '#moveable')


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


window.addEventListener('resize', function () {
    setDim();
})

function warning() {
    var warning = document.getElementById("warning")
    warning.style.display = "none";
}

function setDim() {
    console.log("hi")
    var viz = document.getElementById("viz")
    var windowHeight = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var headerHeight = document.getElementById("header").getBoundingClientRect()
    viz.style.height = `${windowHeight - headerHeight.height}px`
    printArray();
}

function updateDelay() {
    delay = document.getElementById("delay-slider").value;
    document.getElementById("delay-value").innerHTML = delay;
    shuffle
}

function updateSize() {
    if (!currentlySorting) {
        size = document.getElementById("size-slider").value
        document.getElementById("size-value").innerHTML = size;
    }

}

function rndArray() {
    if (!currentlySorting) {
        var size = document.getElementById("size-slider").value
        for (array = [], i = 0; i < size; i++) {
            array[i] = i;
        }
        var tmp, current, top = array.length;
        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
        printArray()
    }
}

function printArray() {
    document.getElementById("viz").innerHTML = "";
    windowWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    arrSize = array.length;
    barSize = windowWidth / arrSize - 1;

    maxVal = Math.max(...array);
    var buff = ""
    for (var i = 0; i < array.length; i++) {
        val = array[i]
        buff += `
        <div class='bar-chart' id="bar${i}" style = "width: ${barSize}px;">
        <div class='bar' style='height: ${Math.round(val / maxVal * 100, 8)}%;'>
        </div>
        </div>
        `
    }
    document.getElementById("viz").innerHTML = buff;
}

async function sortArray() {
    if (!currentlySorting) {
        document.getElementById("sort").innerHTML = "Reset"
        var method = document.getElementById("method").value;
        if (method == 1) {
            await SelectionSort();
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 2) {
            await BubbleSort();
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 3) {
            await InsertionSort();
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 4) {
            await HeapSort();
            setTimeComplexity("O(nlog(n))");
        } else if (method == 5) {
            await MergeSort();
            setTimeComplexity("O(nlog(n))");
        } else if (method == 6) {
            await QuickSort()
            setTimeComplexity("O(nlog(n))");
        } else if (method == 7) {
            await PigeonHoleSort();
            setTimeComplexity("O(n + N)");
        } else if (method == 8) {
            await CombSort()
            setTimeComplexity("O(n<sup>2</sup>/2<sup>p</sup>)");
        } else if (method == 9) {
            await ShellSort()
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 10) {
            await CocktailSort()
            setTimeComplexity("O(n<sup>2</sup>)");
        }
    } else {
        sessionStorage.setItem("reloading", "true");
        location.reload();
    }
    document.getElementById("sort").innerHTML = "Sort"

}

function timeComplexity() {
    if (!currentlySorting) {
        var method = document.getElementById("method").value;
        if (method == 1) {
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 2) {
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 3) {
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 4) {
            setTimeComplexity("O(nlog(n))");
        } else if (method == 5) {
            setTimeComplexity("O(nlog(n))");
        } else if (method == 6) {
            setTimeComplexity("O(nlog(n))");
        } else if (method == 7) {
            setTimeComplexity("O(n + N)");
        } else if (method == 8) {
            setTimeComplexity("O(n<sup>2</sup>/2<sup>p</sup>");
        } else if (method == 9) {
            setTimeComplexity("O(n<sup>2</sup>)");
        } else if (method == 10) {
            setTimeComplexity("O(n<sup>2</sup>)");
        }
    }
}

function setTimeComplexity(comp) {
    bigo = document.getElementById("bigO")
    bigO.innerHTML = comp
}


function sleep(ms) {
    if (ms < 1) {
        ms = 1;
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function endAni() {
    chart = document.getElementById("viz")
    bars = chart.getElementsByClassName("bar")

    for (var i = 0; i < bars.length; i++) {
        bars[i].classList.add("curred")
        await sleep(1);
    }
    await sleep(100)
    for (var i = 0; i < bars.length; i++) {
        bars[i].classList.add("current")
        bars[i].classList.remove("curred");
        await sleep(1);
    }
    await sleep(100)
    await sleep(100)
    for (var i = 0; i < bars.length; i++) {
        bars[i].classList.remove("current");
        await sleep(1);
    }


}

function setCurrent(barNum) {
    chart = document.getElementById("viz")
    bars = chart.getElementsByClassName("bar")
    bar = bars[barNum]
    bar.classList.add("current");
}

function rmCurrent(barNum) {
    chart = document.getElementById("viz")
    bars = chart.getElementsByClassName("bar")
    bar = bars[barNum]
    bar.classList.remove("current");
}

function setUnsorted(start, end) {
    chart = document.getElementById("viz")
    bars = chart.getElementsByClassName("bar")
    for (var i = start; i < end; i++) {
        bars[i].classList.add("unsorted")
    }
}

function swap(arr, i, j) {
    var buff = arr[j]
    arr[j] = arr[i]
    arr[i] = buff
    return arr
}

async function BubbleSort() {
    currentlySorting = true;
    setUnsorted()
    var n = array.length;
    for (var i = 0; i < n - 1; i++) {
        for (var j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                array = swap(array, j, j + 1)
                if (j % (n > 100 ? 5 : 3) == 0) {
                    await printArray();
                    await setUnsorted(0, n - i);
                    await setCurrent(j + 1);
                    await sleep(delay / 3);
                }
            }
        }
    }
    printArray();
    endAni()
    currentlySorting = false
}

async function SelectionSort() {
    currentlySorting = true;
    var n = array.length;
    for (var i = 0; i < n - 1; i++) {
        var min_idx = i;
        for (var j = i + 1; j < n; j++)
            if (array[j] < array[min_idx])
                min_idx = j;

        array = swap(array, min_idx, i)
        await setCurrent(min_idx);
        await sleep(delay);
        await printArray();
        await setUnsorted(i, n);

    }
    await printArray();
    await endAni();
    currentlySorting = false;
}

async function InsertionSort() {
    currentlySorting = true;
    var n = array.length;
    for (var i = 1; i < n; ++i) {
        var buff = array[i];
        var j = i - 1;
        while (j >= 0 && array[j] > buff) {
            array[j + 1] = array[j];
            j = j - 1;
        }
        array[j + 1] = buff;
        await setCurrent(j + 1);
        await setCurrent(i);
        await sleep(delay);
        await printArray();
        await setUnsorted(i, n);
    }

    printArray();
    endAni();
    currentlySorting = false;
}


async function HeapSort() {
    async function heapify(n, i, unsortedIdx) {
        currentlySorting = true;
        var maxVal = i;
        var l = 2 * i + 1;
        var r = l++;
        if (l < n && array[l] > array[maxVal])
            maxVal = l;
        if (r < n && array[r] > array[maxVal])
            maxVal = r;
        if (maxVal != i) {
            array = swap(array, i, maxVal)
            await printArray()
            await setUnsorted(0, unsortedIdx)
            await setCurrent(i);
            await setCurrent(maxVal);
            await sleep(delay / 2);
            await heapify(n, maxVal, unsortedIdx);
        }
    }
    currentlySorting = true;
    var n = array.length;
    for (var i = n / 2 - 1; i >= 0; i--) {
        await heapify(n, i, i);
    }

    await setUnsorted(0, i)
    await setCurrent(n - 1);
    await sleep(delay / 2);
    await printArray()
    for (var i = n - 1; i > 0; i--) {
        array = swap(array, 0, i)
        await heapify(i, 0, i);
        await setCurrent(i);
        await setUnsorted(0, i)
        await sleep(delay);
        await printArray()

    }
    printArray();
    endAni();
    currentlySorting = false;
}

async function MergeSort() {
    async function merge(array, low, middle, high) {
        var buffer1 = []
        var buffer2 = []

        for (var i = low; i <= middle; i++) {
            buffer1.push(array[i])
        }

        for (var j = middle + 1; j <= high; j++) {
            buffer2.push(array[j])
        }

        var k = low
        while (buffer1.length && buffer2.length) {
            if (buffer1[0] < buffer2[0]) {
                array[k] = buffer1.shift()
                await printArray();
                await setUnsorted(high + 1, array.length)
                await setCurrent(k);
                await sleep(delay / 3)
            } else {
                array[k] = buffer2.shift()
                await printArray();
                await setUnsorted(high + 1, array.length)
                await setCurrent(k);
                await sleep(delay / 3)
            }
            k++
        }


        while (buffer1.length) {
            array[k] = buffer1.shift()
            k++
        }
        while (buffer2.length) {
            array[k] = buffer2.shift()
            k++
        }
    }
    async function mergesort(array, low, high) {
        if (low == high) {
            return
        }
        var middle = Math.floor((low + high) / 2)
        await mergesort(array, low, middle)
        for (var i = low; i < middle; i++) {
            await setCurrent(i)
        }
        await sleep(delay / 3)
        await mergesort(array, middle + 1, high)
        for (var i = middle + 1; i < high; i++) {
            await setCurrent(i)
        }
        await sleep(delay / 3)
        await merge(array, low, middle, high)
        await printArray();
        await setUnsorted(high, array.length)

        await sleep(delay / 3)
    }
    currentlySorting = true;
    await mergesort(array, 0, array.length - 1)
    await printArray();
    await endAni();
    currentlySorting = false;

}


async function QuickSort() {
    async function partition(arr, start, end) {
        async function swapVals(i, j) {
            buff = arr[j]
            arr[j] = arr[i]
            arr[i] = buff
            await setCurrent(i)
            await setCurrent(j)
            await sleep(delay)
        }
        var pivot = arr[end];
        let pivotIdx = start;
        for (let i = start; i < end; i++) {
            if (arr[i] < pivot) {
                swapVals(i, pivotIdx)
                await printArray();
                await setUnsorted(pivotIdx, array.length)
                await setCurrent(i)
                await setCurrent(pivotIdx)
                await sleep(delay / 5)
                pivotIdx++;
            }
        }

        swapVals(end, pivotIdx)
        await printArray();
        await setUnsorted(pivotIdx, array.length)
        await setCurrent(end)
        await setCurrent(pivotIdx)
        await sleep(delay / 5)
        return pivotIdx;
    };
    async function quickSort(arr, start, end) {
        if (start >= end) {
            return;
        }
        var index = await partition(arr, start, end);

        await printArray();
        await setUnsorted(index, arr.length)

        for (var i = start; i < index - 1; i++) {
            await setCurrent(i)
            await sleep(1)

        }
        await setUnsorted(start, index - 1)
        await sleep(delay)
        await quickSort(arr, start, index - 1);


        for (var i = index + 1; i < end; i++) {
            await setCurrent(i)
            await sleep(1)

        }
        await sleep(delay)
        await quickSort(arr, index + 1, end);


    }
    currentlySorting = true
    await quickSort(array, 0, array.length - 1)
    await printArray()
    await endAni()
    currentlySorting = false
}

async function PigeonHoleSort() {
    alert("This is a bad visual since it uses 'Pigeonholes' array")
    currentlySorting = true
    var minVal = array[0];
    var maxVal = array[0];
    for (var i = 0; i < array.length; i++) {
        val = array[i]
        if (val > maxVal) {
            maxVal = val;
        }
        if (val < minVal) {
            minVal = val;
        }
    }


    var size = maxVal - minVal + 1;
    var holes = new Array(size).fill(0);

    for (var i = 0; i < array.length; i++) {
        val = array[i];
        holes[val - minVal]++;
    }
    var i = 0;
    for (var j = 0; j < size; j++) {
        while (holes[j] > 0) {
            holes[j]--;
            await printArray()
            await setUnsorted(j + minVal, array.length)
            await setCurrent(j + minVal)
            await setCurrent(i)
            await sleep(delay)
            array[i] = j + minVal;
            i++;
        }
    }
    await printArray()
    await endAni()
    currentlySorting = false
}


async function CombSort() {
    currentlySorting = true
    var gap = array.length;
    var shrink = 1.3;
    var swapped = false;
    var i;
    while (gap != 1 || swapped) {
        gap = Math.floor(gap / shrink);
        if (gap < 1)
            gap = 1;
        i = 0;
        swapped = false;
        while (i + gap < array.length) {
            if (array[i] > array[i + gap]) {
                array = swap(array, i, i + gap)
                swapped = true;
                await printArray();
                await setCurrent(i)
                await setCurrent(i + gap)
                await sleep(delay / 2)
            }
            i++;
        }
    }
    await printArray()
    await endAni()
    currentlySorting = false
};


async function ShellSort() {
    currentlySorting = true
    var gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    for (var g = 0; g < gaps.length; g++) {
        var gap = gaps[g]
        for (var i = gap; i < array.length; i++) {
            var temp = array[i]
            await printArray()
            for (var j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap]
                await setCurrent(j - gap)
                await sleep(delay / 3)
            }
            array[j] = temp
        }
    }
    await printArray()
    await endAni()
    currentlySorting = false
}

async function CocktailSort() {
    currentlySorting = true
    var i
    var l = 0
    var r = array.length - 1
    while (l < r) {
        await printArray()
        await setUnsorted(l, r)
        await sleep(delay / 2)
        for (i = l; i < r; i++) {
            if (array[i] > array[i + 1]) {
                array = swap(array, i, i + 1)
                if (i % 3 == 0) {
                    // This is cause its slow to do every single one
                    await setCurrent(i)
                    await sleep(delay / 8)
                    await rmCurrent(i)
                }
            }
        }
        r--;
        for (i = r; i > l; i--) {
            if (array[i - 1] > array[i]) {
                array = swap(array, i - 1, i)
                if (i % 3 == 0) {
                    // This is cause its slow to do every single one
                    await setCurrent(i)
                    await sleep(delay / 8)
                    await rmCurrent(i)
                }
            }
        }
        l++
    }
    await printArray()
    await endAni()
    currentlySorting = false;

}

