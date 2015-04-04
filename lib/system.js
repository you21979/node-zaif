"use strict";
var LimitRequestPromise = require('limit-request-promise');
var constant = require('./constant');
var lp = exports.lp = new LimitRequestPromise(1,1);
lp.setup([
    {
        host:constant.OPT_LIMIT_HOST, max:1, sec:constant.OPT_LIMIT_SEC,
    }
]);

