const Reservation = require("../classes/Reservaion.js")
const Room = require("../../Room/classes/Room.js")
const appUtils = require("../../shared/helpers/appUtils.js");


module.exports = function (router) {
    router.post("/reservations", function (req, res) {
        appUtils.info("Making a reservation...")

        // Checking required params
        if(req.body.dateStart && !isNaN(new Date(req.body.dateStart).getTime()) && req.body.dateEnd && !isNaN(new Date(req.body.dateEnd).getTime()) && req.body.room && req.body.room.name && Number(req.body.nbOfPeople) > 0) {

            // Check if room is available
            Room.checkAvailability(req.body.dateStart, req.body.dateEnd, req.body.room.name).then(function () {
                // Instantiating reservation
                let reservation = new Reservation(req.body);
                // Saving in db
                reservation.save().then(() => {
                    // Returning reservation with id
                    res.status(200).send(reservation)
                }, (err) => {
                    appUtils.sendError(res, err.message, err.stack, "Internal Error");
                })
            }, function () {
                appUtils.sendError(res, "This room is no longer available", null, "Bad Request");
            })

        } else {
            appUtils.sendError(res, "Invalid params : need dateStart, dateEnd, roomName, numberOfPeople", null, "Bad Request");
        }
    });
}