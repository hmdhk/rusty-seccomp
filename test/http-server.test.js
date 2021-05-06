const seccomp = require('../lib')
const { baseRules, httpServer } = require('./seccomp-rules')

const allowed = {
    "seccomp": {
        "defaultAction": "SCMP_ACT_ERRNO",
        "syscalls": [
            baseRules,
            httpServer
        ]
    }
}

seccomp.apply(JSON.stringify(allowed))
console.log('Seccomp rules applied!')

const http = require('http');

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);
