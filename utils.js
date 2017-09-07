/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */
 
var config = require('config');

module.exports = {
    worker_cost: (parts) => {
        return _.sum(_.map(parts, (x) => { return BODYPART_COST[x]; }))
    },
    
    extraEnergy: function (room) {
        var min_cost = this.worker_cost(config.worker_parts);
    }

};