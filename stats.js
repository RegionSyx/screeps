
function maxSpawnSizeForRoom(room) {
    var spawns = room.find(FIND_MY_SPAWNS);
    var extensions = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION },
    });

    var total = 0;
    total += _.sum(spawns, 'energyCapacity')
    total += _.sum(extensions, 'energyCapacity')

    return total;
}

function maxRegenCostForCreeps(creeps) {
    return _.sum(creeps, c => {
        return _.sum(c.body, part => {
            console.log("{part} {part.type}");
            return BODYPART_COST[part.type];
        });
    });
}

function totalDroppedEnergy(room) {
    return 0;
}

function totalSpawnEnergy(room) {
    return 0;
}

function totalCollectedEnergy(room) {
    return 0;
}

function totalCarriedEnergy(room) {
    return 0;
}

function collectStats() {
    if (!Memory.stats) {
        Memory.stats = {};
    }
    var stats = Memory.stats;

    if (!stats.history) {
        stats.history = [];
    }
    var history = stats.history;

    if (history.length >= 1500) {
        history.shift();
    }

    var data = {};
    _.values(Game.rooms).forEach(room => {
        data = {
            tick: Game.time,
            room_name: room.name,
            total_dropped_energy: totalDroppedEnergy(room),
            total_spawn_energy: totalSpawnEnergy(room),
            total_collected_energy: totalCollectedEnergy(room),
            total_carried_energy: totalCarriedEnergy(room),
        };

    });

    history.push(data);
}

module.exports = {
    maxSpawnSizeForRoom,
    maxRegenCostForCreeps,
    collectStats,
}
