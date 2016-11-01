'use strict';
var assert = require('assert');
var les = require("local-echoserver");
var zaif = require('..');

describe('test', function () {
    var constant = zaif.Constant;
    var apiv1 = zaif.PublicApi;
    it('depth', function (done) {
        this.timeout(5000);
        les(function(url){
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
        }).then(function(){
            done()
        }).catch(function(e){
            done(e)
        })
    })
})
 
