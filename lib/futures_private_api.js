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

var FuturesTradeApi = function(api_key, secret_key, user_agent, nonce_func){
    this.name = "ZAIF-FUTURES";
    this.url = constant.OPT_TLAPI_URL;
    this.api_key = api_key;
    this.secret_key = secret_key;
    this.user_agent = user_agent;
    this.timeout = Math.floor(constant.OPT_TIMEOUT_SEC * 1000);

    var initnonce = new Date() / 1000;
    this.nonce_func = nonce_func || function(){ return initnonce = initnonce + 0.01; }
}

FuturesTradeApi.prototype.query = function(method, mustparams, options){
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

FuturesTradeApi.prototype.getPositions = function(type, options){
    return this.query('get_positions', {
        type : type,
    }, options)
}

FuturesTradeApi.prototype.activePositions = function(type, options){
    return this.query('active_positions', {
        type : type,
    }, options)
}

FuturesTradeApi.prototype.positionHistory = function(type, leverage_id, options){
    return this.query('position_history', {
        type : type,
        leverage_id : leverage_id,
    }, options)
}

FuturesTradeApi.prototype.createPosition = function(type, currency_pair, action, price, amount, leverage, options){
    return this.query('create_position', {
        type : type,
        currency_pair : currency_pair.toLowerCase(),
        action : action.toLowerCase(),
        price : price,
        amount : amount,
        leverage : leverage
    }, options)
}

FuturesTradeApi.prototype.changePosition = function(type, leverage_id, price, options){
    return this.query('change_position', {
        type : type,
        leverage_id : leverage_id,
        price : price,
    }, options)
}

FuturesTradeApi.prototype.cancelPosition = function(type, leverage_id, options){
    return this.query('cancel_position', {
        type : type,
        leverage_id : leverage_id,
    }, options)
}

var createFuturesPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func){
    return new FuturesTradeApi(api_key, secret_key, user_agent, nonce_func)
}

