"use strict";
var lp = require('./system').lp;
var constant = require('./constant');
var HttpApiError = require('@you21979/http-api-error');

var makeapi = function(api){
    return constant.OPT_FAPI_URL + '/' + api;
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

exports.groups = function(group_id){
    return query('groups', group_id);
}
exports.lastPrice = function(group_id, pair){
    return query('last_price', [group_id, pair].join('/'));
}
exports.ticker = function(group_id, pair){
    return query('ticker', [group_id, pair].join('/'));
}
exports.trades = function(group_id, pair){
    return query('trades', [group_id, pair].join('/'));
}
exports.depth = function(group_id, pair){
    return query('depth', [group_id, pair].join('/'));
}
