var behavior = require('behavior');

class roleClaimer extends behavior.BehaviorNode {
    constructor(creep, room, state) {
        super(state || {});
        this.state.room = room;
        this.state.creep = creep;
    }

    run() {
        var creep = this.state.creep;
        if(creep.carry.energy == 0) {
            var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (resource != null) {
                if(creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource);
                    return behavior.RUNNING;
                } else {
                    return behavior.RUNNING;
                }
            } else {
                return behavior.SUCCESS;
            }
        } else {
            var extensions = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            for (var i in extensions) {
                var extension = extensions[i];
                if (extension.energy < extension.energyCapacity){
                    if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extension, { visualizePathStyle: {} });
                        return behavior.RUNNING;
                    } else {
                        if (creep.carry.energy == 0) {
                            return behavior.SUCCESS;
                        } else {
                            return behavior.RUNNING;
                        }
                    }
                }
            }
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
                return behavior.RUNNING;
            } else {
                return behavior.SUCCESS;
            }
        }
        console.log("WHAT!");
    }
}

module.exports = roleClaimer;
