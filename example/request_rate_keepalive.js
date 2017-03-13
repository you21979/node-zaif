var zaif = require('..');
var api = zaif.PublicApi;
var Promise = require('bluebird');

zaif.Constant.OPT_KEEPALIVE = true;

var n = 0;
var r = function(v){
    console.log(++n);
    return v;
}

var w = [
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r),
    api.lastPrice('btc_jpy').then(r)
];

Promise.all(w).then(function(){console.log("OK")})
