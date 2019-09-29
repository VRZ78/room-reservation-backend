'use strict';

//-------------------- App Utils : Tools for log
let appUtils    = module.exports,
    moment      = require('moment'),
    request     = require('request');

/**
 * Display info message
 * @param message
 */
appUtils.info = function(message) {
    console.log('[' + moment().format('YYYY.MM.DD HH:mm:ss') + '] INFO: ' + message);
};
/**
 * Display error message
 * @param message
 */
appUtils.error = function(message){
    console.log('[' + moment().format('YYYY.MM.DD HH:mm:ss') + '] ERROR: ' + message);
};


appUtils.sendError = function(res, message, stack, type) {

    let toSend = {
        type : type,
        message : message,
        stack : stack ? stack : undefined
    };

    res.status(type === "Internal Error" ? 500 : 400).json(toSend)
};