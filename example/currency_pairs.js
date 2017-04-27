var Promise = require('bluebird');
var zaif = require('..');
var api = zaif.PublicApi;

api.currencies().then(console.log)
api.currency_pairs().then(console.log)
