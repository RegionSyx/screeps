var behavior = require("behavior");
var actions = require("actions");
var conditions = require("conditions");


class roleBuilder extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep
        this.source = target.pos.findClosestByRange(
            Game.spawns["Spawn1"].room.find(FIND_SOURCES)
        );
        this.site = target;
    }

    step() {
        return this.run(
            new behavior.Sequence([
                new actions.approach(this.creep, this.source),
                new actions.harvestUntilFull(this.creep, this.source),
                new actions.approach(this.creep, this.site),
                new behavior.UntilFailure(
                    new behavior.Sequence([
                        new behavior.Inverter(
                            new behavior.Selector([
                                new conditions.isCreepEmpty(this.creep),
                //                new conditions.isBuildingFinished(this.site),
                            ])
                        ),
                        new actions.build(this.creep, this.site),
                    ])
                )
            ])
        );
    }
}

module.exports = roleBuilder;
