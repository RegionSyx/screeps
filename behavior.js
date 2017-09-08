const SUCCESS = 1;
const RUNNING = 2;
const FAILURE = 3;

class BehaviorNode {

    constructor(state) {
        this.state = state || [];
    }

    run() {
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
    constructor(children, state) {
        super(state);
        this.children = children || [];
    }
}


class Sequence extends CompositeNode {
    run() {
        for (var i in this.children) {
            status = this.children[i].run();
            if (status == RUNNING) {
                return RUNNING;
            } else if (status == FAILURE) {
                return FAILURE;
            }
        }
        return SUCCESS;
    }
};

class Priority extends CompositeNode {
    run() {
        for (var i in this.children) {
            status = this.children[i].run();
            if (status == RUNNING) {
                return RUNNING;
            } else if (status == SUCCESS) {
                return SUCCESS;
            }
        }
        return FAILURE;
    }
}

class SuccessNode extends BehaviorNode {
    run() { return SUCCESS; }
}
class FailureNode extends BehaviorNode {
    run() { return FAILURE; }
}


class ConditionalNode extends BehaviorNode {
    run() {
        return this.cond() ? SUCCESS : FAILURE;
    }

    cond() {
    }
}

class Inverter extends CompositeNode {
    constructor(child, state) {
        super([child], state);
    }

    run() {
        var status = this.children[0].run()
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
    SuccessNode,
    FailureNode,
    ConditionalNode,
    Inverter
}
