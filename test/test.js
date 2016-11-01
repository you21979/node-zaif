'use strict';
var assert = require('assert');
var les = require("local-echoserver");
var zaif = require('..');

describe('test', function () {
    var constant = zaif.Constant;
    var apiv1 = zaif.PublicApi;
    it('depth', function () {
        return les(function(url){
            constant.OPT_APIV1_URL = url + '/api/1'
            return apiv1.depth('btc_jpy').then(function(v){
                assert(v.asks[0][0] === 1000);
                assert(v.asks[0][1] == 1.0);
                assert(v.asks[1][0] === 1001);
                assert(v.asks[1][1] == 0.9);
                assert(v.bids[0][0] === 999);
                assert(v.bids[0][1] == 1.5);
                assert(v.bids[1][0] === 998);
                assert(v.bids[1][1] == 2.2);
            })
        }, function(res, headers, method, url, body){
            assert(url === '/api/1/depth/btc_jpy');
            var result = JSON.stringify({
                asks:[[1000, 1.0],[1001,0.9]], bids:[[999,1.5],[998,2.2]]
            });
            res.end(result);
        })
    })
    it('lastPrice', function () {
        return les(function(url){
            constant.OPT_APIV1_URL = url + '/api/1'
            return apiv1.lastPrice('btc_jpy').then(function(v){
                assert(v.last_price === 75555.0);
            })
        }, function(res, headers, method, url, body){
            assert(url === '/api/1/last_price/btc_jpy');
            var result = JSON.stringify({"last_price": 75555.0});
            res.end(result);
        })
    })
    it('ticker', function () {
        return les(function(url){
            constant.OPT_APIV1_URL = url + '/api/1'
            return apiv1.ticker('btc_jpy').then(function(v){
                assert(v.last === 75630.0);
                assert(v.high === 75900.0);
                assert(v.low === 73930.0);
                assert(v.vwap === 75048.3677);
                assert(v.volume === 11725.0985);
                assert(v.bid === 75630.0);
                assert(v.ask === 75635.0);
            })
        }, function(res, headers, method, url, body){
            assert(url === '/api/1/ticker/btc_jpy');
            var result = JSON.stringify({
                "last": 75630.0, "high": 75900.0, "low": 73930.0, "vwap": 75048.3677, "volume": 11725.0985, "bid": 75630.0, "ask": 75635.0
            });
            res.end(result);
        })
    })
    it('trades', function () {
        return les(function(url){
            constant.OPT_APIV1_URL = url + '/api/1'
            return apiv1.trades('btc_jpy').then(function(v){
                assert(v instanceof Array)
                assert(v.length === 3)
                assert(v[0].currency_pair === 'btc_jpy')
            })
        }, function(res, headers, method, url, body){
            assert(url === '/api/1/trades/btc_jpy');
            var result = JSON.stringify([
                { date: 1477977267,
                  price: 75695,
                  amount: 0.1,
                  tid: 16301201,
                  currency_pair: 'btc_jpy',
                  trade_type: 'ask' },
                { date: 1477977264,
                  price: 75695,
                  amount: 0.1,
                  tid: 16301200,
                  currency_pair: 'btc_jpy',
                  trade_type: 'ask' },
                { date: 1477977262,
                  price: 75690,
                  amount: 0.6561,
                  tid: 16301199,
                  currency_pair: 'btc_jpy',
                  trade_type: 'ask' }
                ]);
            res.end(result);
        })
    })
})
