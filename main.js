var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCollector = require('role.collector');
var roleClaimer = require('role.claimer');
var roleStarter = require('role.starter');
var roleScout = require('role.scout');
var behavior = require('behavior');
var utils = require('utils');
var config = require('config');
var stats = require('stats');

var flags = _.values(Game.flags);

var sources = [];

flags.filter(flag => flag.color == COLOR_YELLOW)
     .forEach(flag => {
         if(flag.room) {
             sources.push(flag.room.lookForAt(LOOK_SOURCES, flag)[0]);
         }
     })
//var sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
var scouting_locations = flags.filter(flag => flag.color == COLOR_GREEN);

var targetRoom = "W3S94";


function stage0() {
    var workers = [];
    for (var i = 0; i < 4; i++) {
        workers.push({
            name: "Starter[" + i + "]",
            target: sources[i % sources.length],
            role: roleStarter,
            parts: [WORK, CARRY, MOVE, MOVE]
        });
    }

    var sites = Game.spawns["Spawn1"].room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sites.length > 0) {
        for (var i in sources) {
            workers.push({
                name: "Builder[" + i + "]",
                target: sites[0],
                role: roleBuilder,
                parts: [WORK, CARRY, MOVE, MOVE],
            })
        }
    }
    scouting_locations.forEach((flag, i) => {
        workers.push({
            name: "Scout[" + i + "]",
            target: flag.pos,
            role: roleScout,
            parts: [MOVE],
        });
    });

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

            var role = new worker.role(Game.creeps[name], worker.target);

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

    // Put in your main loop

    if (Memory.stats == undefined) {
        Memory.stats = {}
    }

    var rooms = Game.rooms
    var spawns = Game.spawns
    for (let roomKey in rooms) {
        let room = Game.rooms[roomKey]
        var isMyRoom = (room.controller ? room.controller.my : 0)
        if (isMyRoom) {
            Memory.stats['room.' + room.name + '.myRoom'] = 1
            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable
            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable
            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress
            Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal
            var stored = 0
            var storedTotal = 0

            if (room.storage) {
                stored = room.storage.store[RESOURCE_ENERGY]
                storedTotal = room.storage.storeCapacity[RESOURCE_ENERGY]
            } else {
                stored = 0
                storedTotal = 0
            }

            Memory.stats['room.' + room.name + '.storedEnergy'] = stored
        }else {
            Memory.stats['room.' + room.name + '.myRoom'] = undefined
        }
    }
    Memory.stats['gcl.progress'] = Game.gcl.progress
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal
    Memory.stats['gcl.level'] = Game.gcl.level
    Memory.stats['cpu.bucket'] = Game.cpu.bucket
    Memory.stats['cpu.limit'] = Game.cpu.limit
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()

}
