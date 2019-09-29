const sqlTable = require("class-to-sql").sqlTable;
module.exports = class Reservaion extends sqlTable {

    static get TABLE_NAME() {
        return "reservation"
    }

    static get SQL_MAPPING() {
        return {
            id: {
                sqlName: "id",
                type: "Number"
            },
            dateStart: {
                sqlName: "date_start",
                type: "Date"
            },
            dateEnd: {
                sqlName: "date_end",
                type: "Date"
            },
            nbOfPeople: {
                sqlName: "number_of_people",
                type: "Number"
            },
            roomName: {
                sqlName: "room_name",
                type: "String"
            }
        }
    }

    constructor(data) {
        super();
        if (data) {
            this.id = data.id;
            this.dateStart = data.dateStart ? new Date(data.dateStart) : data.dateStart;
            this.dateEnd = data.dateEnd ? new Date(data.dateEnd) : data.dateEnd;
            this.roomName = data.room ? data.room.name : data.room;
            this.nbOfPeople = data.nbOfPeople;
        }
    }

};