"use strict";
var lp = require('./system').lp;
var constant = require('./constant');
var HttpApiError = require('@you21979/http-api-error');

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
        forever: constant.OPT_KEEPALIVE,
        timeout: Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
        transform2xxOnly : true,
        transform: function(body){
            return JSON.parse(body)
        },
    };
}

var query = exports.query = function(method, pair){
    return lp.req(createGetOption(createEndPoint(makeapi(method), pair))).
        then(function(result){
            if('error' in result){
                var error_code = (result.error).toUpperCase().replace(' ', '_');
                throw new HttpApiError(result.error, "API", error_code, result);
            }else{
                return result;
            }
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
exports.currency_pairs = function(pair){
    return query('currency_pairs', pair || "all");
}
exports.currencies = function(pair){
    return query('currencies', pair || "all");
}
