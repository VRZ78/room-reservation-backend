const Reservation = require("../../reservation/classes/Reservaion.js");
const mysql = require("mysql");
const ClassToSql = require("class-to-sql")

module.exports = class Room {

    constructor() {

    }

    /**
     * Check the availability of a room by checking its associated reservation.
     * The room is available if :
     * - there are no reservation that starts or end between the given timerange
     * - there are no reservation that start before the given timerange and stop after it
     */
    static checkAvailability (dateStart, dateEnd, roomName) {
        return new Promise((resolve, reject) => {

            let query = "SELECT * FROM RESERVATION WHERE ((" + mysql.escape(new Date(dateStart)) + " > date_start AND " + mysql.escape(new Date(dateStart)) + " < date_end) OR (" + mysql.escape(new Date(dateEnd)) + " > date_start AND " + mysql.escape(new Date(dateEnd)) + " < date_end) OR  (" + mysql.escape(new Date(dateStart)) + " < date_start AND " + mysql.escape(new Date(dateEnd)) + " > date_end)) AND room_name = " + mysql.escape(roomName) + ";";

            ClassToSql.customQuery(query, Reservation).then(function (results) {
                if(results.length > 0) {
                    reject()
                } else {
                    resolve()
                }
            }, function (err) {
                reject(err)
            })
        })
    }

};