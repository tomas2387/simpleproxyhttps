const httpProxy = require('http-proxy');
const fs = require("fs");
httpProxy.createServer({
    target: {
        host: 'localhost',
        port: 3000
    },
    ssl: {
        key: fs.readFileSync('./ssl/private.pem', 'utf8'),
        cert: fs.readFileSync('./ssl/cert.pem', 'utf8'),
        ca: fs.readFileSync('./ssl/ca.pem', 'utf8')
    }
}).listen(3005);
