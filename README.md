node-zaif
============

[![NPM](https://nodei.co/npm/zaif.jp.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/zaif.jp)  
[![Build Status](https://secure.travis-ci.org/you21979/node-zaif.png?branch=master)](https://travis-ci.org/you21979/node-zaif)
[![Coverage Status](https://coveralls.io/repos/github/you21979/node-zaif/badge.svg?branch=master)](https://coveralls.io/github/you21979/node-zaif?branch=master)

Promise-base Cryptocurrency Exchange zaif.jp API for node.js

install
-------

```
npm i zaif.jp
```

api document
------------
https://corp.zaif.jp/api-docs/

Public API
----------

module prepare
```
var zaif = require('zaif.jp');
var api = zaif.PublicApi;
```

lastprice(pair)
```
api.lastPrice('mona_jpy').then(console.log)
{ last_price: 16.4 }
```

depth(pair)
```
api.depth('mona_jpy').then(console.log)
{ asks:
   [ [ 16.5, 256 ],
     [ 16.6, 21 ],
     [ 16.7, 25 ],
     [ 17, 2392 ],
     [ 17.1, 2042 ],
     [ 17.2, 1000 ],
     [ 17.3, 1075 ],
     [ 17.4, 1135 ],
     [ 17.5, 7914 ],
     [ 17.6, 1002 ],
     [ 17.7, 39 ],
     [ 17.8, 1000 ],
     [ 17.9, 696 ],
     [ 70, 2225 ] ],
  bids:
   [ [ 16.2, 50 ],
     [ 16.1, 356 ],
     [ 16, 1000 ],
     [ 15.7, 206 ],
     [ 15.6, 177 ],
     [ 15.5, 1149 ],
     [ 15.4, 271 ],
     [ 15.2, 203 ],
     [ 15.1, 1697 ],
     [ 0.1, 51162 ] ] }
```

trades(pair)
```
api.trades('mona_jpy').then(console.log)
[ { date: 1410277807,
    price: 16.1,
    amount: 50,
    tid: 18655,
    currency_pair: 'mona_jpy',
    trade_type: 'ask' },
  { date: 1410270931,
    price: 15.6,
    amount: 122,
    tid: 18492,
    currency_pair: 'mona_jpy',
    trade_type: 'bid' },
  { date: 1410270895,
    price: 15.6,
    amount: 1699,
    tid: 18490,
    currency_pair: 'mona_jpy',
    trade_type: 'bid' } ]
```

ticker(pair)
```
api.ticker('mona_jpy').then(console.log)
{ last: 16.1,
  high: 18.9,
  low: 12,
  vwap: 16.0408,
  volume: 221812,
  bid: 16.1,
  ask: 16.2 }
```

Private API
-----------

edit config.json
```
{
 "apikey" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
 "secretkey" : "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
}
```

module prepare
```
var zaif = require('zaif.jp');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync('./config.json').then(JSON.parse).
then(function(config){
    var api = zaif.createPrivateApi(config.apikey, config.secretkey, 'user agent is node-zaif');
    // call api
}).catch(console.log);
```

getinfo()
```
api.getInfo().then(console.log);
{ funds: { jpy: 100000, btc: 0, mona: 0 },
  rights: { info: 1, trade: 1, withdraw: 1 },
  trade_count: 9999,
  open_orders: 0,
  server_time: 1410278546 }
```

trade(pair, 'bid' or 'ask', price, amount)
```
api.trade('mona_jpy', 'bid', 5, 10000).then(console.log);
{ received: 0,
  remains: 10000,
  order_id: 5999,
  funds: { jpy: 50000, btc: 0, mona: 0 } }
```

activeorders()
```
api.activeOrders().then(console.log);
{ '5999':
   { currency_pair: 'mona_jpy',
     action: 'bid',
     amount: 10000,
     price: 5,
     timestamp: '1410279064' } }
```

cancelorder(order_id)
```
api.cancelOrder(5999).then(console.log);
{ order_id: 5999,
  funds: { jpy: 100000, btc: 0, mona: 0 } }
```

Stream API
-----------

```
var zaif = require('zaif.jp');
var w = zaif.createStreamApi('mona_jpy', function(data){
    console.log(data)
});
{ asks: 
   [ [ 17.1, 1576 ],
     [ 17.2, 3446 ],
     [ 17.3, 4226 ],
     [ 17.4, 7366 ],
     [ 17.5, 14613 ],
     [ 17.6, 2420 ],
     [ 17.7, 3300 ],
     [ 17.8, 2184 ],
     [ 17.9, 4520 ],
     [ 18, 3095 ],
     [ 18.1, 1395 ],
     [ 18.2, 1407 ],
     [ 18.3, 2205 ],
     [ 18.5, 3856 ],
     [ 18.6, 2440 ],
     [ 18.8, 3348 ],
     [ 18.9, 1928 ],
     [ 19, 4068 ],
     [ 19.2, 1882 ],
     [ 19.3, 22232 ] ],
  last_price: { action: 'ask', price: 17 },
  trades: 
   [ { currenty_pair: 'mona_jpy',
       trade_type: 'ask',
       price: 17,
       tid: 80618,
       amount: 64,
       date: 1428130395 },
     { currenty_pair: 'mona_jpy',
       trade_type: 'ask',
       price: 17,
       tid: 80617,
       amount: 64,
       date: 1428130337 },
     { currenty_pair: 'mona_jpy',
       trade_type: 'ask',
       price: 17,
       tid: 80616,
       amount: 64,
       date: 1428130278 },
     { currenty_pair: 'mona_jpy',
       trade_type: 'ask',
       price: 16.9,
       tid: 80505,
       amount: 16,
       date: 1428117904 } ],
  bids: 
   [ [ 17, 1133 ],
     [ 16.9, 2390 ],
     [ 16.8, 1944 ],
     [ 16.7, 2370 ],
     [ 16.6, 3585 ],
     [ 16.5, 16985 ],
     [ 16.4, 1390 ],
     [ 16.3, 1981 ],
     [ 16.2, 2399 ],
     [ 16.1, 4210 ],
     [ 16, 9991 ],
     [ 15.9, 2955 ],
     [ 15.8, 1978 ],
     [ 15.7, 1859 ],
     [ 15.6, 1991 ],
     [ 15.5, 2396 ],
     [ 15.4, 50 ],
     [ 15.3, 2219 ],
     [ 15.2, 3172 ],
     [ 15.1, 3862 ] ],
  currency_pair: 'mona_jpy',
  timestamp: '2015-04-04 16:04:14.000419' }

```

Error Handling
--------------

* simple error control

```
api.getInfo().catch(function(e){
    console.log(e.message)
})
```

* technical error control

```
var errors = require('zaif.jp/errors')
api.getInfo()
    .catch(errors.HttpApiError, function (reason) {
        // API ERROR
        console.log(reason.message, "API", reason.error_code)
    })
    .catch(errors.StatusCodeError, function (reason) {
        // HTTP STATUS ERROR(404 or 500, 502, etc...)
        console.log("HTTP StatusCodeError " + reason.statusCode, "HTTP", reason.statusCode)
    })
    .catch(errors.RequestError, function (reason) {
        // REQUEST ERROR(SYSTEMCALL, TIMEOUT)
        console.log(reason.message, "SYSCALL", reason.error.code)
    })
    .catch(function(e){
        // OTHER ERROR
        console.log(e.message)
    })
```

License
-------

MIT License

Donate
------
bitcoin:1DWLJFxmPQVSYER6pjwdaVHfJ98nM76LiN  
monacoin:MCEp2NWSFc352uaDc6nQYv45qUChnKRsKK  

