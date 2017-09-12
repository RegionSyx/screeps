var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCollector = require('role.collector');
var roleClaimer = require('role.claimer');
var roleStarter = require('role.starter');
var utils = require('utils');
var config = require('config');
var stats = require('stats');

var sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);

var targetRoom = "W3S94";

var workers = [];
for (var i in sources) {
    workers.push({
        name: "Starter[" + i + "]",
        roles: [],
        parts: [WORK, CARRY, MOVE, MOVE]
    });
}

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

     for (var i in workers) {
        var worker = workers[i];
        var name = workers[i].name;
        if (!(name in Game.creeps)) {
           if (!Game.spawns["Spawn1"].spawning) {
                Game.spawns["Spawn1"].createCreep(worker.parts, name)
           }
        } else {
            if (!Memory.current_stack) {
                Memory.current_stack = [{}]
            }

            if (!Memory.stack) {
                Memory.stack = {}
            }

            if (!Memory.stack[name]) {
                Memory.stack[name] = [];
            }

            var role = new roleStarter(Game.creeps[name]);

            role.state = Memory.current_stack.pop()
            console.log(role.step());
            Memory.current_stack.push(role.state);

        }
    }

    var towers = [];
    _.values(Game.rooms).forEach(room => {
        room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        }).forEach( v => { towers.push(v); });
    });

    towers.forEach( tower => {
        var structures = tower.room.find(FIND_STRUCTURES);
        structures.forEach(s => {
            console.log(s);
            if (s.hits < s.hitsMax) {
                tower.repair(s);
            }
        });

        var creeps = tower.room.find(FIND_MY_CREEPS);
        creeps.forEach(c => {
            if (c.hits < c.hitsMax) {
                tower.heal(c);
            }
        });

        var enemies = tower.room.find(FIND_HOSTILE_CREEPS);
        enemies.forEach(e => { tower.attack(e); });
    });

    stats.collectStats();
}
