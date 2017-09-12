var behavior = require("behavior");

class approach extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    step() {
        console.log(this.creep);
        if (this.creep.pos.isNearTo(this.target)) {
            return this.success();
        }

        var err = this.creep.moveTo(this.target);
        if (err != OK) {
            return this.failure();
        }

        return this.running();
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
        if (!this.state.status) { this.state.status = null; }
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
        if (!this.state.status) { this.state.status = null; }
        switch (this.state.status) {
            case null:
                this.state.status = this.creep.deposit(this.target);
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
        if (!this.state.status) { this.state.status = null; }
        switch (this.state.status) {
            case null:
                this.state.status = this.creep.upgrade(this.target);
                return this.running();
            case OK:
                return this.success();
            default:
                return this.failure();
        }
    }
}

class isCreepFull extends behavior.Conditional {
    constructor(creep) {
        super();
        this.creep = creep;
    }

    cond() {
        this.creep.carry.energy == this.creep.carryCapacity;
    }
}

class isCreepEmpty extends behavior.Conditional {
    constructor(creep) {
        this.creep = creep;
    }

    cond() {
        this.creep.carry.energy == 0;
    }
}

class isSpawnFull extends behavior.Conditional {
    constructor(spawn) {
        super();
        this.spawn = spawn;
    }

    cond() {
        this.spawn.energy == this.spawn.energyCapacity;
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
            new behavior.Sequence([
                new harvest(this.creep, this.target),
                new isCreepFull(this.creep)
            ])
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
            new behavior.Sequence([
                new deposit(this.creep, this.target),
                new isSpawnFull(this.target)
            ])
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
            new behavior.Sequence([
                new upgrade(this.creep, this.target),
                new isSpawnEmpty(this.creep),
            ])
        );
    }
}


class roleStarter extends behavior.BehaviorNode {
    constructor(creep) {
        super();
        this.creep = creep
    }

    step() {
        var creep = this.creep
        var spawn = Game.spawns["Spawn1"];
        var source = spawn.room.find(FIND_SOURCES)[0];
        var controller = spawn.room.controller;
        return this.run(
            new behavior.Sequence([
                new approach(creep, source),
                new harvestUntilFull(creep, source),
                new approach(creep, spawn),
                new depositUntilFull(creep, spawn),
                new approach(creep, controller),
                new upgradeUntilEmpty(creep, controller),
            ])
        );
    }
}

module.exports = roleStarter;
