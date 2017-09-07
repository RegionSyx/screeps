var roleHarvester = function(target) {
    
    return {
    canWork: function(creep) {
        return true;
        return creep.room.energyAvailable + creep.carry.energy <= creep.room.energyCapacityAvailable;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(true) {
           
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            container = target.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            
            if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        
            extensions = creep.room.find(FIND_STRUCTURES, {
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
            
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }
    };
};

module.exports = roleHarvester;
