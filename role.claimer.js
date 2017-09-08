var behavior = require('behavior');

class roleClaimer extends behavior.BehaviorNode {
    constructor(creep, room, state) {
        super(state || {});
        this.state.room = room;
        this.state.creep = creep;
    }

    run() {
        var creep = this.state.creep;
        var room = this.state.creep.room;
        console.log(room.name);
        console.log(room.name == this.state.room);
        if (room == undefined) {
            var exit = creep.room.find(FIND_EXIT_TOP)[0];
            creep.moveTo(exit, { visualizePathStyle: {} });
            return behavior.RUNNING;
        }
        var status = creep.claimController(this.state.room.controller);
        if(status == ERR_NOT_IN_RANGE) {
            creep.moveTo(this.state.room.controller, { visualizePathStyle: {} });
            return behavior.RUNNING;
        } else if (status == OK) {
            console.log("Claimed Room " + this.state.room.name);
            return behavior.SUCCESS;
        } else {
            console.log("Error claiming controller: " + status);
            return behavior.FAILURE;
        };
    }
}

module.exports = roleClaimer;
