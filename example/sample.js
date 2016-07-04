var Promise = require('bluebird');
var zaif = require('..');
var api = zaif.PublicApi;

Promise.all(
[
    api.lastPrice('btc_jpy').then(function(v){return ['btc_jpy', v.last_price]}),
    api.lastPrice('xem_jpy').then(function(v){return ['xem_jpy', v.last_price]}),
    api.lastPrice('mona_jpy').then(function(v){return ['mona_jpy', v.last_price]}),
    api.lastPrice('mona_btc').then(function(v){return ['mona_btc', v.last_price]})
]
).then(function(res){
    console.log(res.map(function(v){ return v.join('=') }).join('\n'))
})
