const Room = require("../classes/Room.js")
const appUtils = require("../../shared/helpers/appUtils.js");

module.exports = function (router) {
    router.get("/rooms/:roomName/availability", function (req, res) {
        appUtils.info("Checking room availability...")

        // Checking required params
        if(req.query.dateStart && !isNaN(new Date(req.query.dateStart).getTime()) && req.query.dateEnd && !isNaN(new Date(req.query.dateEnd).getTime()) && req.params.roomName) {

            // Checking if the room is available
            Room.checkAvailability(req.query.dateStart, req.query.dateEnd, req.params.roomName).then(function () {
                res.status(200).json({available : true})
            }, function (err) {
                res.status(200).json({available : false})
            })

        } else {
            appUtils.sendError(res, "Invalid params : need dateStart, dateEnd, roomName", null, "Bad Request");
        }
    });
}