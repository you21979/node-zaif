"use strict";
var querystring = require('querystring');
var verify = require('@you21979/simple-verify');
var objectutil = require('@you21979/object-util');
var constant = require('./constant');
var lp = require('./system').lp;
var HttpApiError = require('@you21979/http-api-error');

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

var createPostOption = function(url, api_key, secret_key, user_agent, nonce, timeout, method, params){
    var post = objectutil.keyMerge({nonce:nonce, method:method}, params);
    return {
        url: url,
        method: 'POST',
        forever: constant.OPT_KEEPALIVE,
        form: post,
        headers: createHeader(api_key, secret_key, user_agent, post),
        timeout: timeout,
        transform2xxOnly : true,
        transform: function(body){
            return JSON.parse(body)
        },
    };
}

var req = function(params){
    return lp.req(params)
}

var TradeApi = function(api_key, secret_key, user_agent, nonce_func){
    this.name = "ZAIF";
    this.url = constant.OPT_TAPI_URL;
    this.api_key = api_key;
    this.secret_key = secret_key;
    this.user_agent = user_agent;
    this.timeout = Math.floor(constant.OPT_TIMEOUT_SEC * 1000);

    var initnonce = new Date() / 1000;
    this.nonce_func = nonce_func || function(){ return initnonce = initnonce + 0.01; }
}

TradeApi.prototype.query = function(method, mustparams, options){
    var params = objectutil.keyMerge(mustparams, options);
    return req(createPostOption(this.url, this.api_key, this.secret_key, this.user_agent, this.nonce_func(), this.timeout, method, params)).
        then(function(v){
            if(v.success === 1){
                return v['return'];
            }else{
                var error_code = (v.error).toUpperCase().replace(' ', '_');
                throw new HttpApiError(v.error, "API", error_code, v);
            }
        });
}

TradeApi.prototype.getInfo = function(options){
    return this.query('get_info', {}, options)
}

TradeApi.prototype.getInfo2 = function(options){
    return this.query('get_info2', {}, options)
}

TradeApi.prototype.getPersonalInfo = function(options){
    return this.query('get_personal_info', {}, options)
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
        currency_pair : currency_pair.toLowerCase(),
        action : action.toLowerCase(),
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
        currency : currency.toLowerCase(),
        address : address,
        amount : amount,
    }, options)
}

var createPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func){
    return new TradeApi(api_key, secret_key, user_agent, nonce_func)
}

