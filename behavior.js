const SUCCESS = 1;
const RUNNING = 2;
const FAILURE = 3;

class BehaviorNode {

    constructor() {
        this.state = {};
        this.stack = [];
    }

    restoreStack(stack) {
        if(stack.length > 0) {
            this.state = stack.pop();
        }
        this.stack = stack;
    }

    saveStack(stack) {
        this.stack.push(this.state);
    }

    run(node) {
        var stack = Memory.current_stack;

        node.state = stack.pop() || {};
        node.state.name = this.constructor.name;
        var status = node.step();
        stack.push(node.state);

        return status;
    }

    start() {
    }

    step() {
    }

    end(state) {
    }

    success() {
        return SUCCESS;
    }

    failure() {
        return FAILURE;
    }

    running() {
        return RUNNING;
    }
};

class CompositeNode extends BehaviorNode {
    constructor(children) {
        super();
        this.children = children || [];
    }
}


class Sequence extends CompositeNode {
    start() {
        this.state.i = 0;
    }
    step() {
        if (!this.state.i) { this.state.i = 0 }
        while(this.state.i < this.children.length) {
            var status = this.run(this.children[this.state.i]);
            if (status == RUNNING) {
                return RUNNING;
            } else if (status == FAILURE) {
                return FAILURE;
            }
            this.state.i++;
        }
        return SUCCESS;
    }
};

class Priority extends CompositeNode {
    start() {
        this.state.i = 0;
    }
    step() {
        if (!this.state.i) { this.state.i = 0 }
        while (this.state.i < this.children.length) {
            status = this.run(this.children[this.state.i]);
            if (status == RUNNING) {
                return RUNNING;
            } else if (status == SUCCESS) {
                return SUCCESS;
            }
        }
        return FAILURE;
    }
}

class Success extends BehaviorNode {
    step() { return SUCCESS; }
}
class Failure extends BehaviorNode {
    step() { return FAILURE; }
}


class Conditional extends BehaviorNode {
    step() {
        return this.cond() ? SUCCESS : FAILURE;
    }

    cond() {
    }
}

class Inverter extends BehaviorNode {
    constructor(child) {
        super();
        this.child = child;
    }

    step() {
        var status = this.run(this.child);
        switch (status) {
            case SUCCESS:
                return FAILURE;
                break;
            case RUNNING:
                return RUNNING;
                break
            case FAILURE:
                return SUCCESS;
                break;
        }
    }
}

module.exports = {
    SUCCESS,
    FAILURE,
    RUNNING,
    BehaviorNode,
    CompositeNode,
    Sequence,
    Priority,
    Success,
    Failure,
    Conditional,
    Inverter
}
