const zaif = require('zaif.jp')
const sleep = require('@you21979/promise-sleep')

const initialize = () => {
    zaif.Constant.OPT_KEEPALIVE = true
    zaif.Constant.OPT_TIMEOUT_SEC = 30
}

const main_loop = async () => {
    while(true){
        try{
            const {asks, bids} = await zaif.PublicApi.depth('mona_jpy')
            console.log(asks[0])
            const {last} = await zaif.PublicApi.ticker('mona_jpy')
            console.log(last)
        }catch(e){
            console.log(e)
        }
        await sleep(1000)
    }
}

const main = async () => {
    initialize()
    return main_loop()
}

main()
