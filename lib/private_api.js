var rp = require('request-promise');
var crypto = require('crypto');
var querystring = require('querystring');

var ETWINGS_TAPI_URL = 'https://exchange.etwings.com/tapi';

var createSign = function(argo, key, qstring){
    return crypto.createHmac(argo, key).
        update(new Buffer(qstring)).
        digest('hex').toString();
};
var createHeader = function(api_key, secret_key, user_agent, postdata){
    var qstring = querystring.stringify(postdata);
    var sign = createSign('sha512', secret_key, qstring);
    var h = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': qstring.length,
        'User-Agent': user_agent,
        'Sign': sign,
        'Key': api_key,
    };
    return h;
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
    var headers = createHeader(api_key, secret_key, user_agent, post);
    var opt = {
        url: url,
        method: 'POST',
        form: post,
        headers: headers,
    };
    return opt;
}
var createPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func){
    var url = ETWINGS_TAPI_URL;
    var initnonce = new Date()/1000|0;
    nonce_func = nonce_func || function(){ return initnonce++; }
    var query = function(method, params){
        return rp(createPostOption(url, api_key, secret_key, user_agent, nonce_func(), method, params)).
        then(JSON.parse).then(function(v){            
            if(v.success === 1) return v['return'];
            else throw(new Error(v.error));
        });
    };
    return {
        query : query,
        getInfo : function(){ return query('get_info', {}) },
        tradeHistory : function(params){ return query('trade_history', params) },
        activeOrders : function(params){ return query('active_orders', params) },
        trade : function(params){ return query('trade', params) },
        cancelOrder : function(params){ return query('cancel_order', params) },
        withdraw : function(params){ return query('withdraw', params) },
    };
}

