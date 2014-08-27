var Vision = require('./vision');
var x = new Vision(); 
x.lookup({base:'BTC',counter:'JPY'}).then(console.log);
x.lookup({base:'MONA',counter:'JPY'}).then(console.log);
