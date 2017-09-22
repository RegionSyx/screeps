const SUCCESS = 1;
const RUNNING = 2;
const FAILURE = 3;

class BehaviorNode {

    constructor() {
        this.state = {};
        this.stack = [];
    }

    run(node) {
        var stack = Memory.current_stack;

        node.state = stack.pop() || {};
        node.state.name = node.constructor.name;
        var status = node.step();
        if (status == RUNNING) {
            stack.push(node.state);
        } else {
//            stack.push({});
        }

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

class Selector extends CompositeNode {
    start() {
        this.state.i = 0;
    }
    step() {
        if (!this.state.i) { this.state.i = 0 }
        while (this.state.i < this.children.length) {
            var status = this.run(this.children[this.state.i]);
            if (status == RUNNING) {
                return RUNNING;
            } else if (status == SUCCESS) {
                return SUCCESS;
            }
            this.state.i++;
        }
        return FAILURE;
    }
}

class ParalellSelector extends CompositeNode {
    start() {
        this.state.i = 0;
    }
    step() {
        if (!this.state.i) { this.state.i = 0 }
        while (this.state.i < this.children.length) {
            var status = this.run(this.children[this.state.i]);
            if (status == RUNNING) {
                return RUNNING;
            } else if (status == SUCCESS) {
                return SUCCESS;
            }
            this.state.i++;
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
        var state = this.cond() ? SUCCESS : FAILURE;
        return state
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

class DecoratorNode extends BehaviorNode {
    constructor(child) {
        super();
        this.child = child;
    }
}

class UntilSuccess extends DecoratorNode {
    step() {
        if (this.state.status == undefined) { this.state.status = null }

        while(this.state.status != SUCCESS) {
            this.state.status = this.run(this.child);
            if (this.state.status == RUNNING) {
                return this.running();
            }
        }
        return this.success()
    }
}

class UntilFailure extends DecoratorNode {
    step() {
        if (this.state.status == undefined) { this.state.status = null }

        while(this.state.status != FAILURE) {
            this.state.status = this.run(this.child);
            if (this.state.status == RUNNING) {
                return this.running();
            }
        }
        return this.success()
    }
}

module.exports = {
    SUCCESS,
    FAILURE,
    RUNNING,
    BehaviorNode,
    CompositeNode,
    Sequence,
    Selector,
    Success,
    Failure,
    Conditional,
    Inverter,
    DecoratorNode,
    UntilSuccess,
    UntilFailure,
}
