var roleBuilder = {
    
    canWork: function(creep) {
        if (creep.room.find(FIND_MY_CONSTRUCTION_SITES).length == 0) {
            return false;
        }
        return (creep.room.energyAvailable + creep.carry.energy >= (creep.room.energyCapacityAvailable - 100));
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.carry.energy > 0) {
            const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
             if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        else {
            var err = creep.withdraw(Game.spawns["Spawn1"], RESOURCE_ENERGY);
            
            switch (err) {
                case OK:
                case ERR_BUSY:
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(Game.spawns['Spawn1']);
                    return;
                default:
                    console.log(creep.name + ": " + err);
            }
        }
    }
};

module.exports = roleBuilder;
