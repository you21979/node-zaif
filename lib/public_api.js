"use strict";
var lp = require('./system').lp;
var constant = require('./constant');
var makeapi = function(api){
    return constant.OPT_APIV1_URL + '/' + api;
}
var createEndPoint = function(apiv1, pair){
    return apiv1 + '/' + pair.toLowerCase();
}

var createGetOption = function(url){
    return {
        url: url,
        method: 'GET',
        timeout: Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
    };
}

var query = exports.query = function(method, pair){
    return lp.req(createEndPoint(makeapi(method), pair)).
        then(JSON.parse).
        then(function(result){
            if('error' in result) throw new Error(result.error);
            else return result;
        });
}

exports.lastPrice = function(pair){
    return query('last_price', pair);
}
exports.depth = function(pair){
    return query('depth', pair);
}
exports.trades = function(pair){
    return query('trades', pair);
}
exports.ticker = function(pair){
    return query('ticker', pair);
}
