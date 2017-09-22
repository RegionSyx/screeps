var behavior = require("behavior");
var actions = require("actions");
var conditions = require("conditions");


class roleStarter extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep
        this.source = target;
    }

    step() {
        var creep = this.creep
        var spawn = Game.spawns["Spawn1"];
        var source = this.source;
        var controller = spawn.room.controller;

        return this.run(
            new behavior.Sequence([
                new actions.approach(creep, source),
                new actions.harvestUntilFull(creep, source),
                new behavior.Selector([
                    new behavior.Sequence([
                        new behavior.Inverter(new conditions.isSpawnFull(spawn)),
                        new actions.say(creep, "Going to dump energy into spawn."),
                        new actions.approach(creep, spawn),
                        new actions.deposit(creep, spawn),
                    ]),
                    new behavior.Sequence([
                        new behavior.Inverter(new conditions.isCreepEmpty(creep)),
                        new actions.say(creep, "Going to dump energy into upgrading the controller."),
                        new actions.approach(creep, controller),
                        new actions.upgradeUntilEmpty(creep, controller),
                    ])
                ])
            ])
        );
    }
}

module.exports = roleStarter;
