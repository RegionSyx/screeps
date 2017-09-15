var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCollector = require('role.collector');
var roleClaimer = require('role.claimer');
var roleStarter = require('role.starter');
var behavior = require('behavior');
var utils = require('utils');
var config = require('config');
var stats = require('stats');

var sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);

var targetRoom = "W3S94";


function stage0() {
    var workers = [];
    for (var i = 0; i < 4; i++) {
        workers.push({
            name: "Starter[" + i + "]",
            target: sources[i % sources.length],
            roles: [],
            parts: [WORK, CARRY, MOVE, MOVE]
        });
    }
    return workers;
}

var workers = stage0();


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
            if (!Memory.creeps[name].stack) {
                Memory.creeps[name].stack = [];
            }

            Memory.current_stack = Memory.creeps[name].stack;

            var role = new roleStarter(Game.creeps[name], worker.target);

            var status = role.run(role);
            if (status == behavior.SUCCESS) {
                Memory.current_stack = [];
            } else if (status == behavior.FAILURE) {
                console.log("Failure:\n" + JSON.stringify(Memory.current_stack));
                Memory.current_stack = [];
            }

            Memory.creeps[name].stack = Memory.current_stack;

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
