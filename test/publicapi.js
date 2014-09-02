var etwings = require('..');
var constant = etwings.Constant;
var apiv1 = etwings.PublicApi;
var assert = require('assert');

var http = require('http');

constant.ETWINGS_APIV1_URL = 'http://localhost:3000/api/1'
var selfhost = function(proc){
    var sv = http.createServer(function(req, res){
        proc(req, res);
        res.end();
        sv.close();
    }).listen(3000);
}

selfhost(function(req, res){
    assert(req.url === '/api/1/depth/btc_jpy');
    res.write(JSON.stringify({
        asks:[[1000, 1.0],[1001,0.9]], bids:[[999,1.5],[998,2.2]]
    }));
});
apiv1.depth('btc_jpy').then(function(v){
    assert(v.asks[0][0] === 1000);
    assert(v.asks[0][1] == 1.0);
    assert(v.asks[1][0] === 1001);
    assert(v.asks[1][1] == 0.9);
    assert(v.bids[0][0] === 999);
    assert(v.bids[0][1] == 1.5);
    assert(v.bids[1][0] === 998);
    assert(v.bids[1][1] == 2.2);
});

