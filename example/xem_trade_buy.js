var zaif = require('..');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var main = function(config){
    var api = zaif.createPrivateApi(config.apikey, config.secretkey, 'tradebot');
    var pair = "XEM_JPY";
    var action = "BID";
    var price = 1;
    var amount = 1;

    return api.trade(pair, action, price, amount).then(console.log).catch(console.log)
}

main(config)
