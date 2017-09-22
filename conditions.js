var behavior = require("behavior");

class isCreepFull extends behavior.Conditional {
    constructor(creep) {
        super();
        this.creep = creep;
    }

    cond() {
        return this.creep.carry.energy == this.creep.carryCapacity;
    }
}

class isCreepEmpty extends behavior.Conditional {
    constructor(creep) {
        super();
        this.creep = creep;
    }

    cond() {
         return this.creep.carry.energy == 0;
    }
}

class isSpawnFull extends behavior.Conditional {
    constructor(spawn) {
        super();
        this.spawn = spawn;
    }

    cond() {
        return this.spawn.room.energyAvailable == this.spawn.room.energyCapacityAvailable;
    }
}

module.exports = {
    isCreepFull,
    isCreepEmpty,
    isSpawnFull,
};
