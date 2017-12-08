const zaif = require('..');
const errors = require('../errors')
const fs = require('fs');
const sleep = require("@you21979/promise-sleep")
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const initialize = (config) => {
    zaif.Constant.OPT_KEEPALIVE = true
    const api = zaif.createFuturesPrivateApi(config.apikey, config.secretkey, '');
    return api
}

const main_loop = async (api) => {
    const type = "margin"
    const pair = "btc_jpy"
    const leverage = 7.77
    const price = 1000000
    const amount = 0.1

    const activepos = await api.activePositions(type, {currency_pair: pair})
    console.log(activepos)

    await sleep(1000)

    const createpos = await api.createPosition(type, pair, "bid", price, amount, leverage)
    console.log(createpos)
}

const main = async (config) => {
    const api = initialize(config)
    try{
        await main_loop(api)
    }catch(e){
        console.log(e)
    }
}

main(config)
