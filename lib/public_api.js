var rp = require('request-promise');
var constant = require('./constant');
var makeapi = function(api){
    return constant.ETWINGS_APIV1_URL + '/' + api;
}
var createEndPoint = function(apiv1, pair){
    return apiv1 + '/' + pair.toLowerCase();
}

var query = exports.query = function(method, pair){
    return rp(createEndPoint(makeapi(method), pair)).then(JSON.parse);
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
