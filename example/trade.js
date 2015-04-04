var zaif = require('..');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync('./config.json').then(JSON.parse).
then(function(config){
    var api = zaif.createPrivateApi(config.apikey, config.secretkey, 'tradebot');
    return api.getInfo().then(console.log);
}).catch(console.log);


