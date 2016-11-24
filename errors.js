'use strict';
var objectutil = require('@you21979/object-util');

module.exports = objectutil.keyMerge({
   HttpApiError : require('@you21979/http-api-error'),
}, require('limit-request-promise/errors'));
