var roleCollector = function (target) {
    return {
    canWork: function (creep) {
        return true;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var resource = target.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (resource != null) {
                if(creep.pickup(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource);
                    return;
                }
            }
            
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            
            if(creep.withdraw(container) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
                return;
            }
        }
        else {

            var extensions = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            });
            
            for (var i in extensions) {
                var extension = extensions[i];
                if (extension.energy < extension.energyCapacity){
                    if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extension, { visualizePathStyle: {} });
                        return;
                    }
                }
            }

            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
            });

            for (var i in towers) {
                var tower = towers[i];
                if (tower.energy < tower.energyCapacity){
                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower, { visualizePathStyle: {} });
                        return;
                    }
                }
            }

            
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
    };
};

module.exports = roleCollector;
