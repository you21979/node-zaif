node-etwings
============

etwings is bitcoin and monacoin exchange market.  
You can be automated trading using this module.  

install
-------

```
npm install etwings
```

api document
------------
https://exchange.etwings.com/doc_api

public api
----------

module prepare
```
var etwings = require('etwings');
var api = etwings.PublicApi;
```

lastprice
```
api.lastPrice('mona_jpy').then(console.log)
{ last_price: 16.4 }
```

depth
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

trades
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

ticker
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

License
-------

MIT License

