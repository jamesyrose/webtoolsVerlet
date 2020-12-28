class Node {
    constructor(algorithm, h, parent = null, pos = null) {
        this.algorithm = algorithm;
        this.heuristic = h;
        this.parent = parent;
        this.pos = pos;
        this.visited = false;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.id = `${pos[0]}_${pos[1]}`
    }

    calculateH(endNode) {
        if (this.algorithm !== 'astar') {
            this.h = 0;
            return;
        }

        let dx = (this.pos[0] - endNode.pos[0]);
        let dy = (this.pos[1] - endNode.pos[1]);

        // true euclidian else manhattan
        if (this.heuristic) {
            this.h = Math.sqrt(dx * dx + dy * dy);
        } else {
            this.h = Math.abs(dx) + Math.abs(dy);
        }
    }

    calculateG(currentNode) {
        if (this.pos[0] - currentNode.pos[0] === 0 || this.pos[1] - currentNode.pos[1] === 0) {
            this.g = currentNode.g + 1;
        } else {
            this.g = currentNode.g + Math.SQRT2
        }
    }

    calculateF() {
        this.f = this.g + this.h;
    }

    updateValues(currentNode, endNode) {
        this.calculateG(currentNode);
        this.calculateH(endNode);
        this.calculateF();
    }

    isEqual(other) {
        return ((this.pos[0] === other.pos[0]) && (this.pos[1] === other.pos[1]));
    }
}


class Stack {
    constructor() {
        this.stack = []
    }

    empty() {
        return this.stack.length === 0
    }

    push(item) {
        this.stack.push(item)
    }

    pop() {
        return this.stack.pop()
    }
}