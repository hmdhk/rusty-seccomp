const seccomp = require('../lib')
const { baseRules, childProcessSpawn } = require('./seccomp-rules')

const allowed = {
    "seccomp": {
        "defaultAction": "SCMP_ACT_ERRNO",
        "syscalls": []
    }
}

allowed.seccomp.syscalls.push(baseRules)
allowed.seccomp.syscalls.push(childProcessSpawn)

seccomp.apply(JSON.stringify(allowed))
console.log('Seccomp rules applied!')

const { spawn } = require('child_process');
const child = spawn('pwd');

child.stdout.on('data', (data) => {
    console.log(`child stdout:\n${data}`);
});
