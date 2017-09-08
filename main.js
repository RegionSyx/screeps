var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCollector = require('role.collector');
var roleClaimer = require('role.claimer');
var utils = require('utils');
var config = require('config');

var sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);

var targetRoom = "W3S94";

var workers2 = [];
for (var i in sources) {
    workers2.push({
        name: "Collector[" + i + "]",
        roles: [roleCollector(sources[i])],
        parts: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    });
    workers2.push({
        name: "Harvester[" + i + "]",
        roles: [roleHarvester(sources[i])],
        parts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
    });
}

for (var i = 0; i < 4; i++) {
workers2.push({
    name: "Upgrader[" + i + "]",
    roles: [roleBuilder, roleUpgrader, roleHarvester(sources[i])],
    parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
});
}

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

     for (var i in workers2) {
        var worker = workers2[i];
        var name = workers2[i].name;
        if (!(name in Game.creeps)) {
           if (!Game.spawns["Spawn1"].spawning) {
                Game.spawns["Spawn1"].createCreep(worker.parts, name)
           }
        } else {
            for (var i in worker.roles) {
                var role = worker.roles[i];

                if (role.canWork(Game.creeps[name])) {
                    role.run(Game.creeps[name])
                    break;
                }
            }
        }
    }
}
