const zaif = require('..')
const sleep = require('@you21979/promise-sleep')

const api = zaif.FuturesPublicApi

const initialize = () => {
    zaif.Constant.OPT_KEEPALIVE = true
    zaif.Constant.OPT_TIMEOUT_SEC = 30
}

const main_loop = async () => {
    const groups = await api.groups('all')
    console.log(groups)
    const depth = await api.depth('1', 'btc_jpy')
    console.log(depth)
    const ticker = await api.ticker('1', 'btc_jpy')
    console.log(ticker)
    const trades = await api.trades('1', 'btc_jpy')
    console.log(trades.length)
    const lastprice = await api.lastPrice('1', 'btc_jpy')
    console.log(lastprice)
}

const main = async () => {
    initialize()
    return await main_loop()
}

main()
