var etwings = require('..');

var apikey = '';
var secretkey = '';
var api = etwings.createPrivateApi(apikey, secretkey, 'tradebot');
api.getInfo({}).then(console.log);

