"use strict";
var crypto = require('crypto');
var querystring = require('querystring');
var constant = require('./constant');
var lp = require('./system').lp;
var verify = require('@you21979/simple-verify');

var mergeParams = function(a, b){
    var w = {};
    Object.keys(a || {}).forEach(function(key){
        w[key] = a[key]
    })
    Object.keys(b || {}).forEach(function(key){
        w[key] = b[key]
    })
    return w
}

var createHeader = function(api_key, secret_key, user_agent, postdata){
    var qstring = querystring.stringify(postdata);
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': qstring.length,
        'User-Agent': user_agent,
        'Sign': verify.sign('sha512', secret_key, qstring),
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
        timeout: Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
        transform: function(body){
            return JSON.parse(body)
        },
    };
}

var TradeApi = function(api_key, secret_key, user_agent, nonce_func){
    this.name = "ZAIF";
    this.url = constant.OPT_TAPI_URL;
    this.api_key = api_key;
    this.secret_key = secret_key;
    this.user_agent = user_agent;

    var initnonce = new Date() / 1000;
    this.nonce_func = nonce_func || function(){ return initnonce = initnonce + 0.01; }
}

TradeApi.prototype.query = function(method, mustparams, options){
    var params = mergeParams(mustparams, options);
    return lp.req(createPostOption(this.url, this.api_key, this.secret_key, this.user_agent, this.nonce_func(), method, params)).
        then(function(v){
            if(v.success === 1) return v['return'];
            else throw(new Error(v.error));
        });
}

TradeApi.prototype.getInfo = function(options){
    return this.query('get_info', {}, options)
}

TradeApi.prototype.tradeHistory = function(options){
    return this.query('trade_history', {}, options)
}

TradeApi.prototype.activeOrders = function(options){
    return this.query('active_orders', {}, options)
}

TradeApi.prototype.depositHistory = function(options){
    return this.query('deposit_history', {}, options)
}

TradeApi.prototype.withdrawHistory = function(options){
    return this.query('withdraw_history', {}, options)
}

TradeApi.prototype.trade = function(currency_pair, action, price, amount, options){
    return this.query('trade', {
        currency_pair : currency_pair,
        action : action,
        price : price,
        amount : amount
    }, options)
}

TradeApi.prototype.cancelOrder = function(order_id, options){
    return this.query('cancel_order', {
        order_id : order_id
    }, options)
}

TradeApi.prototype.withdraw = function(currency, address, amount, options){
    return this.query('withdraw', {
        currency : currency,
        address : address,
        amount : amount,
    }, options)
}

var createPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func){
    return new TradeApi(api_key, secret_key, user_agent, nonce_func)
}

