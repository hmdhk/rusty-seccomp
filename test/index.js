const seccomp = require('../lib')
const { baseRules, seccompTemplate } = require('./seccomp-rules')

const allowed = seccompTemplate

allowed.seccomp.syscalls.push(baseRules)

seccomp.apply(JSON.stringify(allowed))
console.log('Seccomp rules applied!')