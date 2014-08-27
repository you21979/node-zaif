var rp = require('request-promise');
var ETWINGS_API_V1_URL = 'https://exchange.etwings.com/api/1';
var makeapi = function(api){
    return ETWINGS_API_V1_URL + '/' + api;
}
var ETWINGS_API_V1 = {
    TRADES : makeapi('trades'),
    DEPTH : makeapi('depth'),
    TICKER : makeapi('ticker'),
};
var createPair = function(marketpair){
    return {
        base : (marketpair.base).toLowerCase(),
        counter : (marketpair.counter).toLowerCase(),
    };
}
var createEndPoint = function(apiv1, pair){
    return apiv1 + '/' + pair.base + '_' + pair.counter;
}

var publicapi = function(api){
    return function(marketpair){
        return rp(createEndPoint(api, createPair(marketpair))).then(JSON.parse);
    }
}

exports.depth = function(marketpair){
    return publicapi(ETWINGS_API_V1.DEPTH)(marketpair);
}
exports.trades = function(marketpair){
    return publicapi(ETWINGS_API_V1.TRADES)(marketpair);
}
exports.ticker = function(marketpair){
    return publicapi(ETWINGS_API_V1.TICKER)(marketpair);
}
