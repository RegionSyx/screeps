var roadPlanner = function(src, dst) {
    var room = src.room;
    var pos1 = src.pos;
    var pos2 = dst.pos;

    var path = room.findPath(pos1, pos2, {
        ignoreCreeps: true,
    });

    for (var i in path) {
        var pos = path[i];
        var err = room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        if (err != OK) {
            console.log("Error placing construction site: " + err);
        }
    }
}

roomRoadPlanner = function(room) {
    var spawners = room.find(FIND_MY_SPAWNS);
    var sources = room.find(FIND_SOURCES);
    for (var i in spawners) {
        roadPlanner(spawners[i], room.controller);
        for (var j in sources) {
            roadPlanner(spawners[i], sources[j]);
        }
    }
}
module.exports = roomRoadPlanner;
