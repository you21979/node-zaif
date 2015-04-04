"use strict";
var constant = require('./constant');
var WebSocket = require('ws');

var makeapi = function(api){
    return constant.OPT_WEBSOCKET_URL + '/' + api;
}
var createEndPoint = function(api, pair){
    return api + '?' + 'currency_pair=' + pair.toLowerCase();
}

var createStreamApi = module.exports = function(pair, receiver){
    var instance = {
        close : function(){},
        debuglog : function(){},
        isReconnect : false,
    };
    var f = function(pair, receiver, instance){
        var uri = createEndPoint(makeapi('stream'), pair);
        var ws = new WebSocket(uri);
        ws.on('open', function(){
            instance.debuglog(['opened', uri]);
            instance.isReconnect = true;
        });
        ws.on('error', function(){
            instance.debuglog(['error', uri]);
            if(instance.isReconnect){
                setTimeout(function(){
                    f(pair, receiver, instance);
                }, 1000)
            }
        });
        ws.on('close', function(){
            instance.debuglog(['closed', uri]);
            if(instance.isReconnect){
                f(pair, receiver, instance);
            }
        })
        ws.on('message', function(data, flags) {
            if(flags.binary){
                instance.debuglog(['recv', 'binary']);
            }else{
                instance.debuglog(['recv', 'string']);
                var w = {}
                try{
                    w = JSON.parse(data);
                }catch(e){
                    instance.debuglog(['exception', 'JSON.parse', data]);
                    return;
                }
                try{
                    receiver(w);
                }catch(e){
                    instance.debuglog(['exception', 'receiver', data]);
                    return;
                }
            }
        });
        instance.close = function(){
            instance.isReconnect = false;
            ws.close();
        }
    }
    f(pair, receiver, instance);
    return instance;
}

