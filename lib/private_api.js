"use strict";
var crypto = require('crypto');
var querystring = require('querystring');
var constant = require('./constant');
var lp = require('./system').lp;

var createSign = function(argo, key, qstring){
    return crypto.createHmac(argo, key).
        update(new Buffer(qstring)).
        digest('hex').toString();
};
var createHeader = function(api_key, secret_key, user_agent, postdata){
    var qstring = querystring.stringify(postdata);
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': qstring.length,
        'User-Agent': user_agent,
        'Sign': createSign('sha512', secret_key, qstring),
        'Key': api_key,
    };
}
var createPostParam = function(objarray){
    var postparams = {};
    objarray.forEach(function(obj){
        Object.keys(obj).forEach(function(key){ postparams[key] = obj[key]; });
    });
    return postparams;
}
var createPostOption = function(url, api_key, secret_key, user_agent, nonce, method, params){
    var post = createPostParam([{nonce:nonce, method:method}, params]);
    return {
        url: url,
        method: 'POST',
        form: post,
        headers: createHeader(api_key, secret_key, user_agent, post),
    };
}
var createPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func){
    var url = function(){ return constant.OPT_TAPI_URL };
    var initnonce = new Date()/1000|0;
    nonce_func = nonce_func || function(){ return initnonce++; }
    var query = function(method, params){
        return lp.req(createPostOption(url(), api_key, secret_key, user_agent, nonce_func(), method, params)).
        then(JSON.parse).then(function(v){            
            if(v.success === 1) return v['return'];
            else throw(new Error(v.error));
        });
    };
    var query_method = function(method){ return function(opt){
        var params = {};
        if(opt instanceof Object) Object.keys(opt).forEach(function(keys){ params[keys] = opt[keys] });
        return query(method, params) };
    };
    return {
        query : query,
        getInfo : function(){ return query('get_info', {}) },
        tradeHistory : query_method('trade_history'),
        activeOrders : query_method('active_orders'),
        depositHistory : query_method('deposit_history'),
        withdrawHistory : query_method('withdraw_history'),
        trade : function(currency_pair, action, price, amount){
            return query('trade', {
                currency_pair : currency_pair,
                action : action,
                price : price,
                amount : amount
            })
        },
        cancelOrder : function(order_id){
            return query('cancel_order', {order_id:order_id})
        },
        withdraw : function(currency, address, amount, opt){
            var params = {
                currency : currency,
                address : address,
                amount : amount
            }
            if(opt instanceof Object) Object.keys(opt).forEach(function(keys){ params[keys] = opt[keys] });
            return query('withdraw', params)
        },
    };
}

