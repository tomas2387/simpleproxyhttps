#! /usr/bin/env node
const args = process.argv.slice(2);

let fromPort = 3005;
let toPort = 3000;
if (args.length > 0) {
    if (args[0] === 'help') {
        console.log('Usage: node index.js [fromPort] [toPort]');
        process.exit(0);
    }

    if (args.length === 1) {
        console.error('You must specify both ports');
        process.exit(1);
    }

    if (args.length > 2) {
        console.error('Too many arguments');
        process.exit(1);
    }

    if (isNaN(args[0]) || isNaN(args[1])) {
        console.error('One or more arguments are not numbers');
        process.exit(1);
    }

    fromPort = args[0];
    toPort = args[1];
}

const httpProxy = require('http-proxy');
const fs = require("fs");

// Check we have the required files for SSL to work
if (!fs.existsSync('./ssl/private.pem')) {
    console.error('Missing file: ./ssl/private.pem');
    process.exit(1);
}
if (!fs.existsSync('./ssl/cert.pem')) {
    console.error('Missing file: ./ssl/cert.pem');
    process.exit(1);
}
if (!fs.existsSync('./ssl/ca.pem')) {
    console.error('Missing file: ./ssl/ca.pem');
    process.exit(1);
}

httpProxy.createServer({
    target: {
        host: 'localhost',
        port: toPort
    },
    ssl: {
        key: fs.readFileSync('./ssl/private.pem', 'utf8'),
        cert: fs.readFileSync('./ssl/cert.pem', 'utf8'),
        ca: fs.readFileSync('./ssl/ca.pem', 'utf8')
    }
}).listen(fromPort);
console.log(`Proxying from port ${fromPort} to port ${toPort}`);
