const express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cors = require('express-cors'),
    classToSql = require('class-to-sql'),
    mysql = require('mysql'),
    Util = require("./app/shared/helpers/appUtils.js");

// Express
let app = express();
let router = express.Router();
let port = 3000;


// Catch and display errors
process.on('uncaughtException', function (err) {
    console.log(err);
    process.exit(1);
});

// Set up models and routes
const loadModel = function (path) {
    fs.exists(path, function (exists) {
        if (exists) {
            fs.readdirSync(path).forEach(function (file) {
                let newPath = path + '/' + file;
                let stat = fs.statSync(newPath);
                if (stat.isFile()) {
                    if (/(.*)\.(js$)/.test(file)) {
                        require(newPath);
                    }
                } else if (stat.isDirectory()) {
                    walk(newPath);
                }
            });
        }
    });
};

const loadRouter = function (path) {
    fs.exists(path, function (exists) {
        if (exists) {
            fs.readdirSync(path).forEach(function (file) {
                let newPath = path + '/' + file;
                let stat = fs.statSync(newPath);
                if (stat.isFile()) {
                    try {
                        if (/(.*)\.(js$)/.test(file)) {
                            try {
                                require(newPath)(router);
                            } catch (ex) {
                                Util.error("Invalid router file " + file, ex);
                            }
                        }
                    } catch (err) {
                        throw err
                    }
                }
            });
        }
    })
};


let modules = ["shared", "reservation", "room"];

for (let i = 0; i < modules.length; i++) {
    loadModel(__dirname + '/app/' + modules[i] + '/classes/');
    loadModel(__dirname + '/app/' + modules[i] + '/helpers/');
    loadRouter(__dirname + '/app/' + modules[i] + '/routes/');
}


console.log("Classes and routes loaded");

// Set up middlewares
app.use(cors({
    allowedOrigins: ['localhost:*', '0.0.0.0:*', 'localhost:*'],
    headers: ['X-Requested-With', 'Content-Type', 'Authorization']
}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);


let configs = {
    test : {
        host: 'localhost',
        user: 'root',
        password: 'passe',
        database: 'reservation-service'
    }
}

const connectToDb = function () {
    // MySQL
    let connection = mysql.createConnection(configs.test);
    connection.connect({}, function (err) {
        if(err) {
            console.log('MySQL Error : ', err);
            process.exit(-1)
        } else {
            console.log("Connected to mysql database");
            classToSql.setConnection(connection);
            classToSql.setDBEngine("MySQL");
            // Start server
            console.log("Server is listening on port " + port);
        }
    });
    connection.on('error', function (err) {
        console.log('MySQL Error : ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToDb();
        } else {
            throw err;
        }
    });
};
connectToDb();

let expressServer = app.listen(port);


