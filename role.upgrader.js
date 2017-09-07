var roleUpgrader = {
    
    canWork: function(creep) {
      return (creep.room.energyAvailable + creep.carry.energy >= (creep.room.energyCapacityAvailable - 100));
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy > 0) {
            err = creep.upgradeController(creep.room.controller);
            switch (err) {
                case OK:
                case ERR_BUSY:
                    return;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(creep.room.controller);
                    return;
                default:
                    console.log(creep.name + ": " + err);
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

module.exports = roleUpgrader;
