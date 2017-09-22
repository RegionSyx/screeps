var behavior = require("behavior");
var actions = require("actions");

class markAllSourcesInCurrentRoom extends behavior.BehaviorNode {
    constructor(creep) {
        super();
        this.creep = creep;
        this.room = creep.room;
    }

    step() {
        var sources = this.room.find(FIND_SOURCES);
        sources.forEach((source) => {
            var flags = this.room.lookForAt(LOOK_FLAGS, source);
            if (flags.length < 1) {
                this.room.createFlag(source, null, COLOR_YELLOW);
            }
        });
        return this.success();
    }
}

class roleScout extends behavior.BehaviorNode {
    constructor(creep, target) {
        super();
        this.creep = creep;
        this.target = target;
    }

    step() {
        return this.run(
            new behavior.Sequence([
                new actions.approach(this.creep, this.target, 0),
                new markAllSourcesInCurrentRoom(this.creep)
            ])
        )
    }
}


module.exports = roleScout;
