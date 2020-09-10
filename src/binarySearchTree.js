class Node {
    constructor(data) {
        this.ads = [data];
        this.timeValue = Date.parse(data.date);
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.result = null;
    }
    insert(data) {
        if (this.root === null) this.root = new Node(data);
        else this.insertNode(this.root, data);
    }

    insertNode(node, data) {
        if (Date.parse(data.date) === node.timeValue) {
            node.ads.push(data);
        } else if (Date.parse(data.date) < node.timeValue) {
            if (node.left === null) node.left = new Node(data);
            else this.insertNode(node.left, data);
        } else {
            if (node.right === null) node.right = new Node(data);
            else this.insertNode(node.right, data);
        }
    }
    _search(node, time) {
        if (node === null) {
            this.result = null;
        }
        if (time === node.timeValue) {
            this.result = node;
        } else if (time < node.timeValue) {
            this._search(node.left, time);
        } else if (time > node.timeValue) {
            this._search(node.right, time);
        }
    }

    search(time) {
        this._search(this.root, Date.parse(time));
        return this.result;
    }

    print() {
        console.log(this.root);
    }
}
