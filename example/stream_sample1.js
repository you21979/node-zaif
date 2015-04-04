var zaif = require('..');
var w = zaif.createStreamApi('btc_jpy', function(data){
    console.log(data)
})
