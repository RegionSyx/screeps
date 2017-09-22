var behavior = require("behavior");
var conditions = require("conditions");

class say extends behavior.BehaviorNode {
    constructor(creep, message) {
        super();
        this.creep = creep;
        this.message = message;
    }

    step() {
        this.creep.say(this.message);
        console.log(this.creep.name + " says: \"" + this.message + "\"");
        return this.success();
    }

}

class approach extends behavior.BehaviorNode {
    constructor(creep, target, range) {
        super();
        this.creep = creep;
        this.target = target;
        this.range = range == undefined ? 1 : range;
    }

    step() {
        if (this.creep.pos.inRangeTo(this.target, this.range)) {
            return this.success();
        }

        var err = this.creep.moveTo(this.target, {visualizePathStyle: {}});
        if (err != OK) {
            return this.failure();
        }

        return this.running();
    }
}

class build extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    start() {
        this.state.status = null;
    }

    step() {
        if (this.state.status == undefined) { this.state.status = null; }
        switch (this.state.status) {
            case null:
                this.state.status = this.creep.build(this.target);
                return this.running();
            case OK:
                return this.success();
            default:
                return this.failure();
        }
    }
}

class harvest extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    start() {
        this.state.status = null;
    }

    step() {
        if (this.state.status == undefined) { this.state.status = null; }
        switch (this.state.status) {
            case null:
                this.state.status = this.creep.harvest(this.target);
                return this.running();
            case OK:
                return this.success();
            default:
                return this.failure();
        }
    }
}

class deposit extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    start() {
        this.state.status = null;
    }

    step() {
        if (this.state.status == undefined) { this.state.status = null; }
        switch (this.state.status) {
            case null:
                this.state.status = this.creep.transfer(this.target, RESOURCE_ENERGY);
                return this.running();
            case OK:
                return this.success();
            default:
                return this.failure();
        }
    }
}

class upgrade extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    start() {
        this.state.status = null;
    }

    step() {
        if (this.state.status == undefined) { this.state.status = null; }
        switch (this.state.status) {
            case null:
                this.state.status = this.creep.upgradeController(this.target);
                return this.running();
            case OK:
                return this.success();
            default:
                return this.failure();
        }
    }
}

class harvestUntilFull extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    step() {
        return this.run(
            new behavior.UntilSuccess(
                new behavior.Sequence([
                    new harvest(this.creep, this.target),
                    new conditions.isCreepFull(this.creep)
                ])
            )
        );
    }
}
class depositUntilFull extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    step() {
        return this.run(
            new behavior.UntilSuccess(
                new behavior.Sequence([
                    new deposit(this.creep, this.target),
                    new isSpawnFull(this.target)
                ])
            )
        );
    }
}

class upgradeUntilEmpty extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    step() {
        return this.run(
            new behavior.UntilSuccess(
                new behavior.Sequence([
                    new upgrade(this.creep, this.target),
                    new conditions.isCreepEmpty(this.creep)
                ])
            )
        );
    }
}


module.exports = {
    say,
    approach,
    harvest,
    deposit,
    upgrade,
    build,
    harvestUntilFull,
    depositUntilFull,
    upgradeUntilEmpty,
};
