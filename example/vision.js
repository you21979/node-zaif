var etwings = require('..');
var apiv1 = etwings.PublicApi;
var Vision = module.exports = function(){
}
Vision.prototype.lookup = function(marketpair){
    return apiv1.depth(marketpair).then(function(v){
        var mapper = function(v){ return {price : v[0], amount: v[1]} }
        var asks = v.asks.map(mapper);
        var bids = v.bids.map(mapper);
        return {base:marketpair.base, counter:marketpair.counter, asks:asks, bids:bids};
    });
}
Vision.prototype.history = function(marketpair){
    return apiv1.trades(marketpair).then(function(v){
        var mapper = function(v){ return v }
        return {base:marketpair.base, counter:marketpair.counter, history:v.map(mapper)};
    });
}
