var moment = require('moment');
var zaif = require('..');

var apiv1 = zaif.PublicApi;

var pair = 'btc_jpy';
var MAX = 20;

var init = function(pair){
    return apiv1.depth(pair).then(function(v){
        return {
            timestamp:'',
            currency_pair: pair,
            lastprice: {action:'', price:0},
            asks: v.asks.slice(0, MAX),
            bids: v.bids.slice(0, MAX),
            trades : [],
        }
    }).then(function(v){
        return apiv1.trades(pair).then(function(trades){
            v.trades = trades.slice(0, MAX);
            if(v.trades.length > 0){
                v.timestamp = moment().format("YYYY-MM-DD HH:mm:ss.000000");
                v.lastprice.action = v.trades[0].trade_type;
                v.lastprice.price = v.trades[0].price;
            }
            return v;
        })
    })
}

var output = function(v){
    console.log(v.timestamp)
    console.log(v.trades.map(function(v){return moment.unix(v.date).format("YYYY-MM-DD HH:mm:ss")}))
}

init(pair).then(function(v){
    var w = zaif.createStreamApi(pair, function(data){
        output(data)
    })
    w.connect();
    return {
        data : v,
        conn : w,
    };
}).then(function(v){
    output(v.data)
    return v.conn;
}).delay(100000).then(function(conn){
    // 100秒たったら終了
    conn.close()
})

