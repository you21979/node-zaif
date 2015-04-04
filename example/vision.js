var zaif = require('..');
var apiv1 = zaif.PublicApi;
var Vision = module.exports = function(){
}

var createPair = function(marketpair){
    return marketpair.base + '_' + marketpair.counter;
}

Vision.prototype.lookup = function(marketpair){
    return apiv1.depth(createPair(marketpair)).then(function(v){
        var mapper = function(v){ return {price : v[0], amount: v[1]} }
        var asks = v.asks.map(mapper);
        var bids = v.bids.map(mapper);
        return {base:marketpair.base, counter:marketpair.counter, asks:asks, bids:bids};
    });
}
Vision.prototype.history = function(marketpair){
    return apiv1.trades(createPair(marketpair)).then(function(v){
        var mapper = function(v){ return v }
        return {base:marketpair.base, counter:marketpair.counter, history:v.map(mapper)};
    });
}
